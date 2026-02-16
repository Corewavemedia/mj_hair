import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { IconStar } from "../components/Icons";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function CartPage() {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    const deliveryFee = 20.00;
    const finalTotal = totalAmount + deliveryFee;

    return (
        <div className="min-h-screen bg-[#EFDCD5] font-['Manrope']">
            <Navbar />
            <div className="pt-40 pb-20 px-6">
                <div className="max-w-[1200px] mx-auto">

                    {cart.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[32px] shadow-sm max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4 font-['Poppins']">Your cart is empty</h2>
                            <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                            <Link
                                to="/shop"
                                className="inline-block bg-[#EF2460] text-white px-10 py-4 rounded-xl font-bold shadow-[0_10px_20px_rgba(239,36,96,0.2)] hover:shadow-[0_15px_30px_rgba(239,36,96,0.3)] hover:-translate-y-1 transition-all"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column: Order Summary */}
                            <div className="lg:col-span-8">
                                <h2 className="text-[#EF2460] font-bold text-2xl mb-8 font-['Poppins']">Order Summary</h2>

                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.productId} className="flex flex-col sm:flex-row gap-6 hover:p-4 rounded-xl hover:shadow-md transition-shadow">
                                            {/* Image */}
                                            <div className="w-[100px] aspect-square flex-shrink-0 rounded-[10px] overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-[#1A1A1A] text-xl font-['Poppins'] leading-tight max-w-[70%]">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[#EF2460] font-bold text-xl">
                                                        £{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Meta Bar */}
                                                <div className="mt-4 sm:mt-0 bg-[#FFF5F5] rounded-xl p-3 flex flex-wrap items-center justify-between gap-4">
                                                    {/* Quantity Control */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#EF2460] font-bold text-sm">£</span>
                                                        <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow-sm">
                                                            <button
                                                                onClick={() => decreaseQuantity(item.productId)}
                                                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#EF2460] font-bold transition"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-sm font-bold text-gray-700 min-w-[1.5rem] text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => increaseQuantity(item.productId)}
                                                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#EF2460] font-bold transition"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-semibold ml-1">units</span>
                                                    </div>

                                                    {/* Specs (Visual Only as per reference feel) */}
                                                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                        <svg className="w-4 h-4 text-[#EF2460]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span>Fast Delivery</span>
                                                    </div>

                                                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                        <IconStar />
                                                        <span>5.0</span>
                                                    </div>
                                                </div>

                                                {/* Remove Link */}
                                                <div className="mt-3 flex justify-end">
                                                    <button
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="text-xs text-gray-400 hover:text-[#EF2460] underline transition"
                                                    >
                                                        Remove Item
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {cart.length > 0 && (
                                    <div className="mt-6 text-right">
                                        <button
                                            onClick={clearCart}
                                            className="text-sm text-gray-400 hover:text-[#EF2460] font-semibold transition"
                                        >
                                            Clear Cart
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Order Details */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-28">
                                    <h2 className="text-[#EF2460] font-bold text-2xl mb-8 font-['Poppins']">Order Details</h2>

                                    <div className="bg-white p-8 rounded-[32px] shadow-sm">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-sm font-bold text-[#1A1A1A]">
                                                <span className="text-gray-500 font-normal">Price</span>
                                                <span>£{totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-bold text-[#1A1A1A]">
                                                <span className="text-gray-500 font-normal">Delivery Fee</span>
                                                <span>£{deliveryFee.toFixed(2)}</span>
                                            </div>

                                            <div className="h-px bg-gray-100"></div>

                                            <div className="flex justify-between items-center text-xl font-bold">
                                                <span className="text-[#1A1A1A]">Total</span>
                                                <span className="text-[#1A1A1A]">£{finalTotal.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate("/checkout")}
                                            className="w-full mt-10 bg-[#FF2A6A] text-white py-4 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(255,42,106,0.2)] hover:shadow-[0_10px_30px_rgba(255,42,106,0.3)] hover:scale-[1.02] transition-all"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
