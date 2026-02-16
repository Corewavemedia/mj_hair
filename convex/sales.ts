import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkAdmin } from "./admin";

export const getOrders = query({
    handler: async (ctx) => {
        await checkAdmin(ctx);
        try {
            const orders = await ctx.db.query("sales").collect();
            // Sort by creation time descending in memory to avoid index issues
            return orders.sort((a, b) => b._creationTime - a._creationTime);
        } catch (error) {
            console.error("Error fetching orders:", error);
            return [];
        }
    },
});

export const createOrder = mutation({
    args: {
        orderId: v.string(),
        status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("cancelled")),
        products: v.array(
            v.object({
                productId: v.id("products"),
                name: v.string(),
                price: v.number(),
                quantity: v.number(),
            })
        ),
        customer: v.object({
            name: v.string(),
            email: v.string(),
            phone: v.string(),
            address: v.string(),
        }),
        transaction: v.object({
            totalAmount: v.number(),
            paymentMethod: v.string(),
            date: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        // 1. Store the order
        const salesId = await ctx.db.insert("sales", args);

        // 2. Update product inventory
        for (const item of args.products) {
            const product = await ctx.db.get(item.productId);
            if (product) {
                // Assuming stockQuantity is stored as string in schema, but we need math
                // The schema says v.string() for stockQuantity.
                const currentStock = parseInt(product.stockQuantity || "0");
                const newStock = Math.max(0, currentStock - item.quantity);

                await ctx.db.patch(item.productId, {
                    stockQuantity: newStock.toString(),
                    // If stock hits 0, maybe update status?
                    stockStatus: newStock === 0 ? "Out of Stock" : product.stockStatus,
                });
            }
        }

        return salesId;
    },
});
