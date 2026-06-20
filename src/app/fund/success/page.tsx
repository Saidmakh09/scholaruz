import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { markContributionPaid } from "@/lib/payments";
import { formatCents } from "@/lib/money";
import { LinkButton } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Thank you" };

type Params = { searchParams: Promise<{ session_id?: string }> };

export default async function FundSuccessPage({ searchParams }: Params) {
  const { session_id } = await searchParams;
  const user = await getSessionUser();

  let amountCents = 0;
  let studentName = "";
  let studentId = "";
  let confirmed = false;

  if (session_id && isStripeConfigured()) {
    const contribution = await prisma.contribution
      .findUnique({
        where: { stripeSessionId: session_id },
        include: { student: { select: { id: true, fullName: true } } },
      })
      .catch(() => null);

    // Only the donor who created this contribution may confirm or view it.
    // (The Stripe webhook is the authoritative, user-independent path.)
    if (contribution && user && contribution.donorUserId === user.id) {
      try {
        const session = await getStripe().checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid") {
          await markContributionPaid(
            session.id,
            typeof session.payment_intent === "string" ? session.payment_intent : null,
            session.amount_total,
          );
          confirmed = true;
        }
      } catch {
        // Fall through to a generic thank-you below.
      }

      amountCents = contribution.amountCents;
      studentName = contribution.student.fullName;
      studentId = contribution.student.id;
      confirmed = confirmed || contribution.status === "SUCCEEDED";
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
        🎉
      </div>
      <h1 className="mt-6 text-3xl font-bold text-ink">Thank you for your contribution!</h1>

      {amountCents > 0 ? (
        <p className="mt-3 text-lg text-slate-600">
          Your gift of <span className="font-semibold text-brand-700">{formatCents(amountCents)}</span>
          {studentName ? (
            <>
              {" "}
              toward <span className="font-semibold">{studentName}</span>&apos;s education
            </>
          ) : null}{" "}
          {confirmed ? "has been confirmed." : "is being processed."}
        </p>
      ) : (
        <p className="mt-3 text-lg text-slate-600">
          Your contribution has been received. Thank you for supporting a student&apos;s future.
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {studentId && (
          <LinkButton href={`/students/${studentId}`} variant="outline">
            Back to student
          </LinkButton>
        )}
        <LinkButton href="/dashboard">View my contributions</LinkButton>
      </div>
    </div>
  );
}
