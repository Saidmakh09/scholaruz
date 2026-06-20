import "server-only";
import { prisma } from "./db";

/**
 * Idempotently confirm a contribution from its Stripe Checkout session id.
 * Safe to call multiple times and from multiple sources (webhook + success
 * page) concurrently. The status transition is enforced atomically at the
 * database level (only PENDING → SUCCEEDED).
 *
 * `paidAmountCents` (Stripe's `amount_total`) is verified against the amount we
 * recorded at checkout, so a contribution is never credited for an amount the
 * platform did not actually collect.
 */
export async function markContributionPaid(
  stripeSessionId: string,
  paymentIntentId: string | null,
  paidAmountCents?: number | null,
) {
  const contribution = await prisma.contribution.findUnique({
    where: { stripeSessionId },
  });
  if (!contribution) return null;

  // Defense in depth: the amount Stripe collected must match our record.
  if (
    typeof paidAmountCents === "number" &&
    paidAmountCents !== contribution.amountCents
  ) {
    console.error(
      `Contribution amount mismatch for session ${stripeSessionId}: recorded ${contribution.amountCents}, Stripe reported ${paidAmountCents}. Not confirming.`,
    );
    return null;
  }

  // Atomic, idempotent transition: only a PENDING contribution becomes
  // SUCCEEDED. A FAILED/REFUNDED/already-SUCCEEDED row is left untouched.
  const result = await prisma.contribution.updateMany({
    where: { id: contribution.id, status: "PENDING" },
    data: {
      status: "SUCCEEDED",
      stripePaymentIntentId: paymentIntentId ?? contribution.stripePaymentIntentId ?? undefined,
    },
  });

  if (result.count === 1) {
    await syncStudentFundedStatus(contribution.studentId);
  }

  return prisma.contribution.findUnique({ where: { id: contribution.id } });
}

/** Idempotently mark a still-pending contribution as failed/expired. */
export async function markContributionFailed(stripeSessionId: string) {
  await prisma.contribution.updateMany({
    where: { stripeSessionId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

/** Mark a previously-succeeded contribution refunded (driven by a Stripe refund event). */
export async function markContributionRefundedByPaymentIntent(paymentIntentId: string) {
  const contribution = await prisma.contribution.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
  });
  if (!contribution) return null;

  const result = await prisma.contribution.updateMany({
    where: { id: contribution.id, status: "SUCCEEDED" },
    data: { status: "REFUNDED" },
  });

  if (result.count === 1) {
    await syncStudentFundedStatus(contribution.studentId);
  }
  return contribution;
}

/**
 * Keep a student's status in sync with the money they have actually raised.
 * Only ever toggles between APPROVED and FUNDED, never disturbs a profile that
 * is PENDING_REVIEW or ARCHIVED. This means a refund that drops a student below
 * their goal correctly reverts them from FUNDED back to APPROVED.
 */
async function syncStudentFundedStatus(studentId: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { contributions: { select: { amountCents: true, status: true } } },
  });
  if (!student) return;
  if (student.status !== "APPROVED" && student.status !== "FUNDED") return;

  const raised = student.contributions
    .filter((c) => c.status === "SUCCEEDED")
    .reduce((acc, c) => acc + c.amountCents, 0);

  const target = raised >= student.goalAmountCents ? "FUNDED" : "APPROVED";
  if (target !== student.status) {
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: { status: target },
    });
  }
}
