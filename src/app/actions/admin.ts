"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { dollarsToCents, formatCents } from "@/lib/money";

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath("/admin/contributions");
  revalidatePath("/admin/disbursements");
  revalidatePath("/students");
}

const statusSchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(["PENDING_REVIEW", "APPROVED", "FUNDED", "ARCHIVED"]),
});

export async function setStudentStatusAction(formData: FormData): Promise<void> {
  await requireRole("ADMIN");
  const parsed = statusSchema.safeParse({
    studentId: formData.get("studentId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await prisma.studentProfile.update({
    where: { id: parsed.data.studentId },
    data: { status: parsed.data.status },
  });
  revalidateAdmin();
}

export type DisbursementState = { error?: string; success?: string };

const disbursementSchema = z.object({
  studentId: z.string().min(1, "Choose a student."),
  amountDollars: z.coerce
    .number()
    .positive("Amount must be greater than zero.")
    .max(1_000_000, "Amount is too large."),
  reference: z.string().trim().max(120).optional(),
  note: z.string().trim().max(500).optional(),
});

export async function createDisbursementAction(
  _prev: DisbursementState,
  formData: FormData,
): Promise<DisbursementState> {
  const admin = await requireRole("ADMIN");

  const parsed = disbursementSchema.safeParse({
    studentId: formData.get("studentId"),
    amountDollars: formData.get("amountDollars"),
    reference: formData.get("reference") ?? "",
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const amountCents = dollarsToCents(parsed.data.amountDollars);

  // Read the balance and create the disbursement atomically so two concurrent
  // (or double-submitted) requests can't both pass the check and over-disburse.
  let outcome: DisbursementState;
  try {
    outcome = await prisma.$transaction(
      async (tx) => {
        const student = await tx.studentProfile.findUnique({
          where: { id: parsed.data.studentId },
          include: {
            contributions: { select: { amountCents: true, status: true } },
            disbursements: { select: { amountCents: true, status: true } },
          },
        });
        if (!student) return { error: "Student not found." } as DisbursementState;

        const raised = student.contributions
          .filter((c) => c.status === "SUCCEEDED")
          .reduce((acc, c) => acc + c.amountCents, 0);
        // SCHEDULED funds are reserved/encumbered, so they count against the
        // held balance too, otherwise scheduling repeatedly would overcommit.
        const alreadyOut = student.disbursements
          .filter(
            (d) => d.status === "SCHEDULED" || d.status === "SENT" || d.status === "CONFIRMED",
          )
          .reduce((acc, d) => acc + d.amountCents, 0);
        const heldBalance = raised - alreadyOut;

        if (amountCents > heldBalance) {
          return {
            error: `Cannot disburse more than the held balance of ${formatCents(heldBalance)}.`,
          } as DisbursementState;
        }

        await tx.disbursement.create({
          data: {
            studentId: student.id,
            amountCents,
            reference: parsed.data.reference || null,
            note: parsed.data.note || null,
            createdByUserId: admin.id,
            status: "SCHEDULED",
          },
        });

        return {
          success: `Scheduled ${formatCents(amountCents)} for ${student.fullName}.`,
        } as DisbursementState;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (err) {
    console.error("createDisbursement error:", err);
    return { error: "Could not schedule the disbursement. Please try again." };
  }

  if (outcome.success) revalidateAdmin();
  return outcome;
}

const advanceSchema = z.object({
  disbursementId: z.string().min(1),
  to: z.enum(["SENT", "CONFIRMED"]),
});

export async function advanceDisbursementAction(formData: FormData): Promise<void> {
  await requireRole("ADMIN");
  const parsed = advanceSchema.safeParse({
    disbursementId: formData.get("disbursementId"),
    to: formData.get("to"),
  });
  if (!parsed.success) return;

  // Enforce the SCHEDULED → SENT → CONFIRMED state machine atomically: the
  // update only applies if the row is currently in the expected prior state,
  // which also closes the lost-update race on concurrent transitions.
  const expectedPrev = parsed.data.to === "SENT" ? "SCHEDULED" : "SENT";
  const now = new Date();
  const result = await prisma.disbursement.updateMany({
    where: { id: parsed.data.disbursementId, status: expectedPrev },
    data:
      parsed.data.to === "SENT"
        ? { status: "SENT", sentAt: now }
        : { status: "CONFIRMED", confirmedAt: now },
  });
  if (result.count === 1) revalidateAdmin();
}
