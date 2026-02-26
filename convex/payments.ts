import type { ActionCtx } from "./_generated/server";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const processPayment = action({
  args: { 
    token: v.string(), 
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(), // "card" | "klarna"
    reference: v.string(),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
  },
  handler: async (_ctx: ActionCtx, args) => {
    const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;
    const PROCESSING_CHANNEL_ID = process.env.CHECKOUT_PROCESSING_CHANNEL_ID;

    if (!SECRET_KEY || !PROCESSING_CHANNEL_ID) {
      throw new Error("Checkout.com keys not configured");
    }

    const payload: any = {
      amount: args.amount,
      currency: args.currency,
      reference: args.reference,
      processing_channel_id: PROCESSING_CHANNEL_ID,
      customer: args.customerEmail ? {
        email: args.customerEmail,
        name: args.customerName,
      } : undefined,
    };

    if (args.paymentMethod === "card") {
      payload.source = {
        type: "token",
        token: args.token,
      };
    } else {
      // Klarna or other APM
      payload.source = {
        type: "id",
        id: args.token, // For Klarna, the token is the authorization_token
      };
    }

    const response = await fetch("https://api.sandbox.checkout.com/payments", {
      method: "POST",
      headers: {
        "Authorization": SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: any;
    try {
        data = await response.json();
    } catch (e) {
        console.error("Failed to parse Checkout.com response:", e);
        return { 
            success: false, 
            approved: false,
            error: "Invalid response from payment provider",
        };
    }

    if (!response.ok) {
        console.error("Checkout.com Payment Error:", data);
        return { 
            success: false, 
            approved: false,
            error: data.error_type || "Payment failed",
            details: data.error_codes
        };
    }

    return { 
        success: true, 
        approved: data.approved !== false,
        id: data.id,
        status: data.status
    };
  },
});