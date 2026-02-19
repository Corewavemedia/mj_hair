import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
    User,
    ShoppingBag,
    CreditCard,
    HelpCircle,
    LogOut,
    ArrowRight,
    LayoutDashboard
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Footer from "../components/Footer";
import { useState } from "react";
import UserOrders from "../components/dashboard/UserOrders";
import PersonalData from "../components/dashboard/PersonalData";
import PaymentMethods from "../components/dashboard/PaymentMethods";
import HelpCenter from "../components/dashboard/HelpCenter";
import { useEffect } from "react";

export default function UserDashboard() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("orders");

    // Fetch real data from Convex
    const customer = useQuery(api.customers.getCurrentCustomer);
    const convexUser = useQuery(api.users.currentUser);
    const orders = useQuery(api.orders.getUserOrders);

    // Calculate stats based on real orders
    const totalOrders = orders ? orders.length : 0;
    const completedOrders = orders ? orders.filter((o: any) => o.orderStatus === "completed").length : 0;
    const pendingOrders = orders ? orders.filter((o: any) => o.orderStatus === "pending").length : 0;

    const stats = [
        { label: "Total Orders", value: totalOrders.toString(), change: "", isPositive: true },
        { label: "Completed Orders", value: completedOrders.toString(), change: "", isPositive: true },
        { label: "Pending Orders", value: pendingOrders.toString(), change: "", isPositive: true },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const logLogin = useMutation(api.settings.logLogin);

    useEffect(() => {
        if (isLoaded && user && !sessionStorage.getItem("hasLoggedLogin")) {
            // Log login entry only once per session
            logLogin({
                device: navigator.platform + " - " + navigator.userAgent,
                location: "London, UK", // Placeholder
                ipAddress: "192.168.1.1", // Placeholder
            }).then(() => {
                sessionStorage.setItem("hasLoggedLogin", "true");
            }).catch(e => console.error("Failed to log login:", e));
        }
    }, [isLoaded, user]);

    if (!isLoaded) return <div>Loading...</div>;

    // Use customer data or fallback to Clerk user data
    const displayName = customer?.username || (customer ? `${customer.firstName} ${customer.lastName}` : (user?.fullName || "User"));
    const displayEmail = customer?.email || user?.primaryEmailAddress?.emailAddress;

    const renderContent = () => {
        switch (activeTab) {
            case "data":
                return <PersonalData />;
            case "orders":
                return <UserOrders orders={orders} stats={stats} />;
            case "payments":
                return <PaymentMethods />;
            case "support":
                return <HelpCenter />;
            default:
                return <UserOrders orders={orders} stats={stats} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F3] pt-8 font-['Manrope',sans-serif]">
            <Navbar />
            <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-8 mx-auto">
                {/* DESKTOP SIDEBAR - Hidden on Mobile */}
                <div className="hidden lg:block w-[320px] shrink-0 space-y-6">
                    <div className="bg-white rounded-[24px] p-6 text-center shadow-sm sticky top-24">
                        <div className="relative inline-block mb-4">
                            <img
                                src={user?.imageUrl}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-[#BD713E] p-1.5 rounded-full border-2 border-white">
                                <User className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
                        <p className="text-gray-500 text-sm mb-6">{displayEmail}</p>

                        <div className="bg-[#BD713E]/10 rounded-xl p-4 text-left mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-800 text-sm">My Orders</span>
                                <button onClick={() => setActiveTab("orders")} className="text-[#BD713E] text-xs font-bold hover:underline">See All</button>
                            </div>
                            {orders && orders.length > 0 && orders[0] ? (
                                <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs">📦</div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{orders[0].items[0]?.name || "Order"}</p>
                                            <p className="text-[10px] text-[#BD713E] font-bold">£ {orders[0].totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <span className="bg-[#BD713E] text-white text-[10px] px-2 py-1 rounded-full capitalize">{orders[0].orderStatus}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 text-center py-2">No active orders</div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <SidebarItem icon={<User size={18} />} label="Personal Data" active={activeTab === "data"} onClick={() => setActiveTab("data")} />
                            <SidebarItem icon={<ShoppingBag size={18} />} label="Orders" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
                            <SidebarItem icon={<CreditCard size={18} />} label="Payment Methods" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />

                            <div className="pt-4 pb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase ml-4 mb-2">Support</p>
                                <SidebarItem icon={<HelpCircle size={18} />} label="Help Center" active={activeTab === "support"} onClick={() => setActiveTab("support")} />
                                {convexUser?.isAdmin && (
                                    <a
                                        href="/admin"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition hover:bg-gray-50 mt-2 border border-dashed border-[#BD713E]/30"
                                    >
                                        <div className="flex items-center gap-3 text-[#BD713E]">
                                            <LayoutDashboard size={18} />
                                            <span className="text-sm font-bold">Admin Dashboard</span>
                                        </div>
                                        <ArrowRight size={16} className="text-[#BD713E]" />
                                    </a>
                                )}
                            </div>

                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-medium text-sm mt-4 border border-red-100">
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE HEADER & NAV - Visible Only on Mobile */}
                <div className="lg:hidden w-full space-y-6">
                    {/* Compact Profile Header */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm flex items-center gap-4">
                        <div className="relative shrink-0">
                            <img src={user?.imageUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover" />
                            <div className="absolute bottom-0 right-0 bg-[#BD713E] p-1 rounded-full border-2 border-white">
                                <User className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 truncate">{displayName}</h2>
                            <p className="text-gray-500 text-xs truncate">{displayEmail}</p>
                            <button onClick={handleSignOut} className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                                <LogOut size={12} /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Horizontal Navigation */}
                    <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide -mx-4 px-4">
                        {[
                            { id: "orders", label: "Orders", icon: <ShoppingBag size={16} /> },
                            { id: "data", label: "Profile", icon: <User size={16} /> },
                            { id: "payments", label: "Payments", icon: <CreditCard size={16} /> },
                            { id: "support", label: "Help", icon: <HelpCircle size={16} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm border border-transparent
                                ${activeTab === tab.id
                                        ? "bg-[#BD713E] text-white shadow-[#BD713E]/20"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border-gray-100"}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                        {convexUser?.isAdmin && (
                            <a
                                href="/admin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-xl transition"
                            >
                                <button
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all border border-transparent bg-white text-gray-600 hover:bg-gray-50 border-gray-100"
                                >
                                    <LayoutDashboard size={18} />
                                    <span className="text-sm font-bold">Admin Dashboard</span>
                                    <ArrowRight size={16} className="text-[#BD713E]" />
                                </button>
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 space-y-6">
                    {renderContent()}
                </div>
            </div>
            <Footer />
        </div>
    );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition ${active ? 'bg-[#BD713E]/10' : 'hover:bg-gray-50'}`}
        >
            <div className="flex items-center gap-3 text-gray-600">
                <span className={active ? "text-[#BD713E]" : ""}>{icon}</span>
                <span className={`text-sm font-bold ${active ? "text-gray-900" : ""}`}>{label}</span>
            </div>
            <ArrowRight size={16} className={`text-gray-300 ${active ? "opacity-100" : "opacity-0"}`} />
        </div>
    )
}
