export const adminEmails = [
    "jenniferikhazuangbe642@gmail.com",
    "admin@mjhairpalace.co.uk"
];

export const adminPhoneNumbers = [
    "whatsapp:+2348123456789" // Example, to be managed/used as needed
];


export async function checkAdmin(ctx: { auth: { getUserIdentity: () => Promise<any> } }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthorized");
    }
    const email = identity.email as string;
    if (!adminEmails.includes(email)) {
        throw new Error("Forbidden");
    }
    return identity;
}
