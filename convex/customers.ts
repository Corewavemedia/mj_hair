import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentCustomer = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const clerkId = identity.subject;

        const customer = await ctx.db
            .query("customers")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .unique();

        return customer;
    },
});

export const updateCustomer = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        username: v.optional(v.string()),
        phone: v.string(),
        address: v.object({
            street: v.string(),
            city: v.string(),
            zipCode: v.string(),
            country: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const clerkId = identity.subject;
        const customer = await ctx.db
            .query("customers")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .unique();

        if (!customer) {
            // Need to create one if it doesn't exist? Ideally 'store' in users.ts or a separate sync handles creation.
            // But if it's missing here, let's create it for robustness or throw.
            // For now, I'll assume it exists or create it.
            const newId = await ctx.db.insert("customers", {
                clerkId,
                firstName: args.firstName,
                lastName: args.lastName,
                email: identity.email || "",
                username: args.username,
                phone: args.phone,
                address: args.address,
                orders: [],
                createdAt: Date.now(),
            });
            return newId;
        }

        await ctx.db.patch(customer._id, {
            firstName: args.firstName,
            lastName: args.lastName,
            username: args.username,
            phone: args.phone,
            address: args.address,
        });

        return customer._id;
    },
});
