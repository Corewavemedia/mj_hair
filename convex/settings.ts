import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLoginHistory = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("loginHistory")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .order("desc")
            .take(10);
    },
});

export const logLogin = mutation({
    args: {
        device: v.string(),
        location: v.string(),
        ipAddress: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return; // Can't log if not logged in

        await ctx.db.insert("loginHistory", {
            clerkId: identity.subject,
            device: args.device,
            location: args.location,
            ipAddress: args.ipAddress,
            timestamp: Date.now(),
        });
    },
});
