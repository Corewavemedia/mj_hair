import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import type { Id } from "../../convex/_generated/dataModel";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({
    totalAmount,
    onSubmitSuccess
}: {
    totalAmount: number;
    onSubmitSuccess: (paymentIntentId: string) => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (error) {
                setMessage(error.message ?? "An unexpected error occurred.");
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setIsProcessing(false);
                onSubmitSuccess(paymentIntent.id);
            } else {
                setMessage("Payment processing...");
                setIsProcessing(false);
            }
        } catch (err) {
            setMessage("An unexpected error occurred.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" onReady={() => setIsReady(true)} />
            {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
            <button
                disabled={isProcessing || !stripe || !elements || !isReady}
                id="submit"
                className="w-full bg-[#EF2460] text-white py-4 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(239,36,96,0.2)] hover:shadow-[0_10px_30px_rgba(239,36,96,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
            >
                {isProcessing ? "Processing..." : (!isReady ? "Loading Payment..." : `Pay £${totalAmount.toLocaleString()}`)}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const { cart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const { user, isLoaded, isSignedIn } = useUser();

    // Mutations and Actions
    const createOrder = useMutation(api.orders.createOrder);
    const createPaymentIntent = useAction(api.payments.createPaymentIntent);
    const userOrders = useQuery(api.orders.getUserOrders);

    const [clientSecret, setClientSecret] = useState("");
    const [form, setForm] = useState({
        country: "",
        state: "",
        phone: "",
        email: "",
        address: ""
    });

    const [hasAutofilled, setHasAutofilled] = useState(false);

    useEffect(() => {
        if (userOrders && userOrders.length > 0 && !hasAutofilled && !form.address) {
            const lastOrder = userOrders[0];
            if (lastOrder.shippingAddress) {
                const parts = lastOrder.shippingAddress.split(", ");
                if (parts.length >= 3) {
                    const country = parts[parts.length - 1];
                    const state = parts[parts.length - 2];
                    const streetAddress = parts.slice(0, parts.length - 2).join(", ");

                    setForm(prev => ({
                        ...prev,
                        country,
                        state,
                        address: streetAddress
                    }));
                    setHasAutofilled(true);
                }
            }
        }
    }, [userOrders, hasAutofilled, form.address]);

    const deliveryFee = 20.00;
    const finalTotal = totalAmount + deliveryFee;

    useEffect(() => {
        if (finalTotal > 0 && !clientSecret) {
            createPaymentIntent({ amount: Math.round(finalTotal * 100) })
                .then((data) => {
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    }
                })
                .catch((err) => console.error("Error creating payment intent:", err));
        }
    }, [finalTotal, createPaymentIntent, clientSecret]);


    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
                <p>Your cart is empty. <button onClick={() => navigate("/")} className="text-[#EF2460] font-bold">Go back</button></p>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOrderCreation = async (paymentIntentId: string) => {
        if (!isLoaded || !isSignedIn || !user) {
            alert("You must be logged in to place an order.");
            return;
        }

        // Final validation before order creation (payment is already successful)
        if (!form.address || !form.country) {
            // This case should be handled before payment, but as a safeguard
            alert("Shipping address missing.");
            return;
        }

        try {
            const orderItems = cart.map(item => ({
                productId: item.productId as Id<"products">,
                quantity: item.quantity,
                price: item.price,
                name: item.name
            }));

            await createOrder({
                items: orderItems,
                totalPrice: finalTotal,
                shippingAddress: `${form.address}, ${form.state}, ${form.country}`,
                paymentIntentId: paymentIntentId,
            });

            clearCart();
            navigate("/success");
        } catch (error) {
            console.error("Order creation failed:", error);
            alert("Payment successful but order creation failed. Please contact support.");
        }
    };

    const paymentElementOptions = useMemo(() => ({
        clientSecret,
        appearance: { theme: 'stripe' as const },
    }), [clientSecret]);

    return (
        <div className="min-h-screen bg-[#FFF5F7] font-['Manrope']">
            <Navbar />

            <div className="max-w-[1200px] mx-auto pt-40 pb-20 px-6">

                {/* Breadcrumbs / Header area */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2 font-['Poppins']">Checkout Page</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <span>Details</span>
                        <span className="text-gray-300">›</span>
                        <span>Shopping Cart</span>
                        <span className="text-gray-300">›</span>
                        <span className="text-[#EF2460]">Checkout</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Form Section */}
                    <div className="flex-1 bg-white p-8 lg:p-10 rounded-[24px] shadow-sm">
                        <div className="space-y-8">

                            {/* Contact & Region Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1A1A] mb-3">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#EF2460] outline-none transition placeholder-gray-400 text-sm font-medium"
                                        placeholder="Enter Country"
                                        value={form.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1A1A] mb-3">State/Union Territory</label>
                                    <input
                                        type="text"
                                        name="state"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#EF2460] outline-none transition placeholder-gray-400 text-sm font-medium"
                                        placeholder="Enter State"
                                        value={form.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <input
                                type="text"
                                name="address"
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-[#EF2460] outline-none text-sm placeholder-gray-400"
                                placeholder="Full Address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            />

                            {/* Payment Method Section */}
                            <div>
                                <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Payment Method</h2>
                                {clientSecret && (
                                    <Elements options={paymentElementOptions} stripe={stripePromise}>
                                        <CheckoutForm totalAmount={finalTotal} onSubmitSuccess={handleOrderCreation} />
                                    </Elements>
                                )}
                                {!clientSecret && (
                                    <div className="p-4 text-center text-gray-500">
                                        Loading payment details...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Details Summary */}
                    <div className="w-full lg:w-[400px]">
                        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6 font-['Poppins']">Order Details</h2>

                        <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium text-[#1A1A1A]">
                                    <span>Price</span>
                                    <span className="font-bold">£{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-[#1A1A1A]">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold">£{deliveryFee.toFixed(2)}</span>
                                </div>

                                <div className="h-px bg-gray-100 my-2"></div>

                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-[#1A1A1A]">Total</span>
                                    <span className="text-[#1A1A1A]">£{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}