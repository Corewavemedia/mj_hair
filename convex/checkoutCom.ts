import { action } from "./_generated/server";
import { v } from "convex/values";

const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;
const PROCESSING_CHANNEL_ID = process.env.CHECKOUT_PROCESSING_CHANNEL_ID;

export const createPaymentContext = action({
    args: {
        amount: v.number(),
        currency: v.string(),
        reference: v.string(),
        items: v.array(v.any()),
        customerEmail: v.string(),
        customerName: v.string(),
        billingAddress: v.object({
            address_line1: v.string(),
            address_line2: v.optional(v.string()),
            city: v.string(),
            zip: v.string(),
            country: v.string(),
        }),
    },
    handler: async (_ctx, args) => {
        if (!SECRET_KEY || !PROCESSING_CHANNEL_ID) {
            throw new Error("Checkout.com keys not configured");
        }

        const response = await fetch("https://api.sandbox.checkout.com/payment-contexts", {
            method: "POST",
            headers: {
                "Authorization": SECRET_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                source: {
                    type: "id",
                    id: "klarna"
                },
                amount: args.amount,
                currency: args.currency,
                reference: args.reference,
                items: args.items,
                customer: {
                    email: args.customerEmail,
                    name: args.customerName,
                },
                billing: {
                    address: args.billingAddress
                },
                processing_channel_id: PROCESSING_CHANNEL_ID,
            }),
        });

        const data = await response.json() as any;
        if (!response.ok) {
            throw new Error(data.error_type || "Failed to create payment context");
        }

        return {
            id: data.id,
            partner_metadata: data.partner_metadata,
            clientToken: data.partner_metadata?.client_token || data.client_token
        };
    },
});
