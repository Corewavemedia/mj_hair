import { v } from "convex/values";
import { internalMutation, httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

export const fulfillOrder = internalMutation({
  args: {
    paymentIntentId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { paymentIntentId, status }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_paymentIntentId", (q) => q.eq("paymentIntentId", paymentIntentId))
      .first();

    if (order) {
      await ctx.db.patch(order._id, {
        paymentStatus: status === "succeeded" ? "paid" : "failed",
      });
    }
  },
});

export const handleStripeWebhook = httpAction(async (ctx, request) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await ctx.runMutation(internal.stripe.fulfillOrder, {
        paymentIntentId: paymentIntent.id,
        status: "succeeded",
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await ctx.runMutation(internal.stripe.fulfillOrder, {
        paymentIntentId: paymentIntent.id,
        status: "failed",
      });
      break;
    }
    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
});
