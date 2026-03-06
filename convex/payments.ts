import { action } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

export const createPaymentIntent = action({
    args: { amount: v.number() },
    handler: async (_ctx, { amount }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2025-02-24.acacia",
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "gbp",
            payment_method_types: ["card", "klarna"]
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    },
});