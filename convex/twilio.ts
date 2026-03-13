import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

export const sendAdminWhatsAppNotification = internalAction({
  args: {
    orderId: v.string(),
    customerName: v.string(),
    totalPrice: v.number(),
    items: v.array(v.object({
      name: v.string(),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const { orderId, customerName, totalPrice, items } = args;

    if (!accountSid || !authToken || !twilioNumber || !adminNumber) {
      console.error("Twilio credentials or WhatsApp numbers missing from environment variables.");
      return;
    }

    const client = twilio(accountSid, authToken);

    const itemsSummary = items.map(item => `- ${item.name} (x${item.quantity})`).join("\n");
    const message = `🛍️ *New Order Alert!*\n\n*Order ID:* ${orderId.slice(-6)}\n*Customer:* ${customerName}\n*Total:* £${totalPrice.toLocaleString()}\n\n*Items:*\n${itemsSummary}\n\nView details in your dashboard.`;

    try {
      await client.messages.create({
        from: twilioNumber,
        to: adminNumber,
        body: message,
      });
      console.log(`WhatsApp notification sent to admin for order ${orderId}`);
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
    }
  },
});

export const testSendMessage = internalAction({
  args: {},
  handler: async (ctx) => {
    if (!accountSid || !authToken || !twilioNumber || !adminNumber) {
      return "Missing credentials";
    }
    const client = twilio(accountSid, authToken);
    try {
      await client.messages.create({
        from: twilioNumber,
        to: adminNumber,
        body: "🚀 This is a test WhatsApp notification from MJ's Hair Palace!",
      });
      return "Message sent successfully!";
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }
})
