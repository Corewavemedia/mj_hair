import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { CountrySelect } from "../ui/CountrySelect";

export default function PersonalData() {
    const { user } = useUser();
    const customer = useQuery(api.customers.getCurrentCustomer);
    const updateCustomerMutation = useMutation(api.customers.updateCustomer);

    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        addressFullName: "",
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
        country: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username || "",
                firstName: customer.firstName || "",
                lastName: customer.lastName || "",
                email: customer.email || "",
                phone: customer.phone || "",
                addressFullName: (customer.address as any)?.fullName || (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : ""),
                line1: (customer.address as any)?.line1 || (customer.address as any)?.street || "",
                line2: (customer.address as any)?.line2 || "",
                city: customer.address?.city || "",
                postalCode: (customer.address as any)?.postalCode || (customer.address as any)?.zipCode || "",
                country: customer.address?.country || ""
            });
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.primaryEmailAddress?.emailAddress || "",
                addressFullName: user.fullName || ""
            }));
        }
    }, [customer, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryChange = (code: string) => {
        setFormData(prev => ({ ...prev, country: code }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateCustomerMutation({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                phone: formData.phone,
                address: {
                    fullName: formData.addressFullName,
                    line1: formData.line1,
                    line2: formData.line2,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                }
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[24px] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Poppins']">Personal Data & Address</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Information */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">1</span>
                        Profile Information
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="@username"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-100 text-gray-400 cursor-not-allowed font-bold"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+44 7911 123456"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Address Settings */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">2</span>
                        Address Settings
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Address Full Name</label>
                            <input
                                type="text"
                                name="addressFullName"
                                value={formData.addressFullName}
                                onChange={handleChange}
                                placeholder="Recipient Name"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Address Line 1</label>
                            <input
                                type="text"
                                name="line1"
                                value={formData.line1}
                                onChange={handleChange}
                                placeholder="123 Main St"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                name="line2"
                                value={formData.line2}
                                onChange={handleChange}
                                placeholder="Apt 4B"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#BD713E] focus:ring-1 focus:ring-[#BD713E] outline-none transition font-bold text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <CountrySelect value={formData.country} onChange={handleCountryChange} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#BD713E] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#A55F2C] transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
