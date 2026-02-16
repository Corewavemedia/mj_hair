import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPaymentMethods = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("paymentMethods")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .order("desc")
            .collect();
    },
});

export const addPaymentMethod = mutation({
    args: {
        type: v.string(),
        last4: v.string(),
        expiryMonth: v.string(),
        expiryYear: v.string(),
        cardHolderName: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // Make others non-default if this is the first one? Or just add it.
        // For simplicity, just add.

        await ctx.db.insert("paymentMethods", {
            clerkId: identity.subject,
            type: args.type,
            last4: args.last4,
            expiryMonth: args.expiryMonth,
            expiryYear: args.expiryYear,
            cardHolderName: args.cardHolderName,
            isDefault: false, // Default logic can be added later
            createdAt: Date.now(),
        });
    },
});

export const deletePaymentMethod = mutation({
    args: { id: v.id("paymentMethods") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const method = await ctx.db.get(args.id);
        if (!method || method.clerkId !== identity.subject) {
            throw new Error("Not items found or unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});
