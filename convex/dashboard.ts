import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { checkAdmin } from "./admin";

export const getDashboardData = query({
    handler: async (ctx) => {
        await checkAdmin(ctx);
        return await ctx.db.query("dashboardData").collect();
    },
});

export const addDashboardItem = mutation({
    args: {
        title: v.string(),
        value: v.number(),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.insert("dashboardData", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
