import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

const MIN_CENTS = 100; // $1
const MAX_CENTS = 2_000_000; // $20,000

const bodySchema = z.object({
  studentId: z.string().min(1),
  amountCents: z.number().int().min(MIN_CENTS).max(MAX_CENTS),
  message: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to contribute." }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid amount between $1 and $20,000." },
      { status: 400 },
    );
  }
  const { studentId, amountCents, message } = parsed.data;

  const student = await prisma.studentProfile.findUnique({ where: { id: studentId } });
  if (!student || (student.status !== "APPROVED" && student.status !== "FUNDED")) {
    return NextResponse.json({ error: "This student is not accepting contributions." }, { status: 404 });
  }

  // Record the intent first so we can reconcile it regardless of redirect outcome.
  const contribution = await prisma.contribution.create({
    data: {
      donorUserId: user.id,
      studentId: student.id,
      amountCents,
      message: message?.trim() || null,
      status: "PENDING",
    },
  });

  const origin =
    req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Contribution to ${student.fullName}`,
              description: `${student.fieldOfStudy} · ${student.school}`,
            },
          },
        },
      ],
      metadata: {
        contributionId: contribution.id,
        studentId: student.id,
        donorUserId: user.id,
      },
      success_url: `${origin}/fund/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/students/${student.id}?canceled=1`,
    });

    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Roll the pending intent back to FAILED so it doesn't pollute reconciliation.
    await prisma.contribution.update({
      where: { id: contribution.id },
      data: { status: "FAILED" },
    });
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
