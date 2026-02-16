import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkAdmin } from "./admin";

/**
 * Identify a visitor by hashing their IP (handled in action usually) or just use a client-generated ID + IP string if we don't have actions enabled for IP.
 * For simplicity and privacy without Actions, we'll trust a client-generated sessionId or fingerprint, 
 * but the prompt asks for "ipHash".
 * 
 * Since we can't easily get IP in a pure mutation without an Action or HTTP endpoint, 
 * we will accept an `ipHash` passed from the client (which the client can generate via a specialized service or we simulate it).
 * 
 * ACTUALLY: The prompt asks to "Capture... user agent...". 
 * We will store what the client sends.
 */

export const trackVisit = mutation({
    args: {
        ipHash: v.string(), // Client will send a fingerprint/hash
        userAgent: v.string(),
        path: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const clerkId = identity?.subject;

        await ctx.db.insert("visitors", {
            ipHash: args.ipHash,
            userAgent: args.userAgent,
            path: args.path,
            clerkId: clerkId,
            visitedAt: Date.now(),
        });
    },
});

export const getVisitorCount = query({
    handler: async (ctx) => {
        // Protected by admin check as it's for the dashboard
        await checkAdmin(ctx);
        const visitors = await ctx.db.query("visitors").collect();
        return visitors.length;
    },
});
