import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkAdmin } from "./admin";
export const getOrders = query({
    handler: async (ctx) => {
        await checkAdmin(ctx);
        const orders = await ctx.db.query("orders").collect();

        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                let customer = null;
                if (order.clerkId) {
                    customer = await ctx.db
                        .query("customers")
                        .withIndex("by_clerkId", (q) => q.eq("clerkId", order.clerkId!)) // Non-null assertion safe due to check
                        .unique();
                }

                // Use order snapshot details if available (preferred for history), fallback to customer record
                const name = order.customerName || (customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer");
                const email = order.customerEmail || customer?.email || "unknown@example.com";
                const phone = order.customerPhone || customer?.phone || "Unknown";

                return {
                    ...order,
                    customer: {
                        name,
                        email,
                        phone,
                        address: order.shippingAddress,
                    },
                };
            })
        );

        return enrichedOrders.sort((a, b) => b.createdAt - a.createdAt);
    },
});

export const getUserOrders = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const clerkId = identity.subject;

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .collect();

        // Sort orders by createdAt descending
        return orders.sort((a, b) => b.createdAt - a.createdAt);
    },
});


import { internalMutation, internalQuery } from "./_generated/server";

export const createOrder = mutation({
    args: {
        items: v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
            price: v.number(),
            name: v.string(),
        })),
        totalPrice: v.number(),
        shippingAddress: v.string(),
        paymentIntentId: v.string(),
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const clerkId = identity?.subject || null; // Optional: Link to user if logged in

        const { items, totalPrice, shippingAddress, paymentIntentId, customerName, customerEmail, customerPhone } = args;

        const phone = customerPhone || "";

        // 1. Create Order
        const orderId = await ctx.db.insert("orders", {
            clerkId: clerkId || undefined, // Store clerkId if available
            customerName,
            customerEmail,
            customerPhone: phone,
            items,
            totalPrice,
            orderStatus: "pending",
            paymentStatus: "paid",
            shippingAddress,
            paymentIntentId,
            createdAt: Date.now(),
        });

        // 2. Manage Customer Record
        // Try to find existing customer by email (guest or user) or clerkId
        let existingCustomer = null;
        if (clerkId) {
            existingCustomer = await ctx.db
                .query("customers")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
                .first();
        }
        if (existingCustomer) {
            // Start of Selection
            const currentOrders = existingCustomer.orders || [];
            await ctx.db.patch(existingCustomer._id, {
                orders: [...currentOrders, orderId],
            });
            // End of Selection
        } else {
            // Create new customer record for this guest/user
            const nameParts = customerName.split(" ");
            await ctx.db.insert("customers", {
                clerkId: clerkId || undefined, // Optional
                firstName: nameParts[0] || "Unknown",
                lastName: nameParts.slice(1).join(" ") || "",
                email: customerEmail,
                phone: phone,
                username: customerEmail.split("@")[0],
                orders: [orderId],
                createdAt: Date.now(),
            });
        }

        return orderId;
    },
});

export const createOrderInternal = internalMutation({
    args: {
        clerkId: v.optional(v.string()),
        items: v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
            price: v.number(),
            name: v.string(),
        })),
        totalPrice: v.number(),
        shippingAddress: v.string(),
        sessionId: v.string(),
        paymentIntentId: v.string(),
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.string(),
    },
    handler: async (ctx, args) => {
        const { clerkId, items, totalPrice, shippingAddress, sessionId, paymentIntentId, customerName, customerEmail, customerPhone } = args;

        // Idempotency: Check if order already exists for this session
        const existing = await ctx.db
            .query("orders")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
            .first();

        if (existing) {
            return existing._id;
        }

        // 1. Create Order
        const orderId = await ctx.db.insert("orders", {
            clerkId,
            customerName,
            customerEmail,
            customerPhone,
            items,
            totalPrice,
            orderStatus: "pending",
            paymentStatus: "paid",
            shippingAddress,
            sessionId,
            paymentIntentId,
            createdAt: Date.now(),
        });

        // 2. Check for Customer and Link Order
        let existingCustomer = null;
        if (clerkId) {
            existingCustomer = await ctx.db
                .query("customers")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
                .unique();
        }

        if (existingCustomer) {
            await ctx.db.patch(existingCustomer._id, {
                orders: [...existingCustomer.orders, orderId],
            });
        } else {
            // Best effort to create customer record if missing
            // If clerkId is present, try to get user data, otherwise use provided customer args
            let name = customerName;
            let email = customerEmail;
            let phone = customerPhone;

            if (clerkId) {
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_token", (q) => q.eq("tokenIdentifier", clerkId))
                    .unique();
                if (user) {
                    name = user.name;
                    email = user.email;
                }
            }

            const nameParts = name.split(" ");

            await ctx.db.insert("customers", {
                clerkId,
                firstName: nameParts[0] || "Unknown",
                lastName: nameParts.slice(1).join(" ") || "",
                email,
                phone,
                username: email.split("@")[0],
                orders: [orderId],
                createdAt: Date.now(),
            });
        }

        return orderId;
    },
});

export const updateOrderStatus = mutation({
    args: {
        orderId: v.id("orders"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.patch(args.orderId, {
            orderStatus: args.status,
        });
    },
});


export const createCheckout = internalMutation({
    args: {
        clerkId: v.string(),
        items: v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
            price: v.number(),
            name: v.string(),
        })),
        totalPrice: v.number(),
        shippingAddress: v.string(),
        sessionId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("checkouts", {
            ...args,
            status: "pending",
        });
    },
});

export const markCheckoutCompleted = internalMutation({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        const checkout = await ctx.db
            .query("checkouts")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
            .first();

        if (checkout) {
            await ctx.db.patch(checkout._id, { status: "completed" });
        }
    },
});

export const getCheckout = internalQuery({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("checkouts")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
            .unique();
    },
});
