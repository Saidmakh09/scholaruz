import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  markContributionFailed,
  markContributionPaid,
  markContributionRefundedByPaymentIntent,
} from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  // The raw, unparsed body is required for signature verification.
  const payload = await req.text();

  let event: Stripe.Event;
  if (webhookSecret && signature) {
    try {
      event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // No webhook secret configured. Refuse rather than trust an unsigned body.
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await markContributionPaid(
          session.id,
          typeof session.payment_intent === "string" ? session.payment_intent : null,
          session.amount_total,
        );
      }
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await markContributionFailed(session.id);
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (paymentIntentId) {
        await markContributionRefundedByPaymentIntent(paymentIntentId);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
