import { Plus, Trash2, CreditCard as CardIcon, X } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function PaymentMethods() {
    const paymentMethods = useQuery(api.paymentMethods.getPaymentMethods) || [];
    const addPaymentMethod = useMutation(api.paymentMethods.addPaymentMethod);
    const deletePaymentMethod = useMutation(api.paymentMethods.deletePaymentMethod);

    const [isAdding, setIsAdding] = useState(false);
    const [newCard, setNewCard] = useState({
        cardHolderName: "",
        last4: "",
        expiryMonth: "",
        expiryYear: "",
        type: "visa"
    });

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addPaymentMethod({
                cardHolderName: newCard.cardHolderName,
                last4: newCard.last4,
                expiryMonth: newCard.expiryMonth,
                expiryYear: newCard.expiryYear,
                type: newCard.type
            });
            alert("Card added successfully");
            setIsAdding(false);
            setNewCard({ cardHolderName: "", last4: "", expiryMonth: "", expiryYear: "", type: "visa" });
        } catch (error) {
            alert("Failed to add card");
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to remove this card?")) return;
        try {
            await deletePaymentMethod({ id });
            alert("Card removed");
        } catch (error) {
            alert("Failed to remove card");
        }
    };

    return (
        <div className="bg-white rounded-[24px] p-8 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-['Poppins']">Payment Methods</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-pink-50 text-[#EF2460] px-4 py-2 rounded-xl text-sm font-bold hover:bg-pink-100 transition"
                >
                    <Plus size={16} /> Add New Card
                </button>
            </div>

            {/* Add Card Modal / Form Overlay */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] p-8 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setIsAdding(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Card</h3>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Cardholder Name</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-[#EF2460]"
                                    value={newCard.cardHolderName}
                                    onChange={e => setNewCard({ ...newCard, cardHolderName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Last 4 Digits</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-[#EF2460]"
                                        value={newCard.last4}
                                        onChange={e => setNewCard({ ...newCard, last4: e.target.value })}
                                        maxLength={4}
                                        placeholder="1234"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Card Type</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-[#EF2460]"
                                        value={newCard.type}
                                        onChange={e => setNewCard({ ...newCard, type: e.target.value })}
                                    >
                                        <option value="visa">Visa</option>
                                        <option value="mastercard">Mastercard</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Exp Month</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-[#EF2460]"
                                        value={newCard.expiryMonth}
                                        onChange={e => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                                        maxLength={2}
                                        placeholder="MM"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Exp Year</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-[#EF2460]"
                                        value={newCard.expiryYear}
                                        onChange={e => setNewCard({ ...newCard, expiryYear: e.target.value })}
                                        maxLength={2}
                                        placeholder="YY"
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-full bg-[#EF2460] text-white py-3 rounded-xl font-bold shadow-lg mt-4">Save Card</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {paymentMethods.length === 0 && (
                    <div className="text-center py-10 text-gray-400">No payment methods added yet.</div>
                )}
                {paymentMethods.map((method: any) => (
                    <div key={method._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-pink-100 hover:shadow-sm transition group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-8 rounded-md flex items-center justify-center text-xs font-bold ${method.type === 'visa' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                {method.type === 'visa' ? 'VISA' : 'MC'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm capitalize">{method.type} ending in {method.last4}</p>
                                <p className="text-gray-400 text-xs">Expires {method.expiryMonth}/{method.expiryYear}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {method.isDefault && <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Default</span>}
                            <button onClick={() => handleDelete(method._id)} className="text-gray-300 hover:text-red-500 transition">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-[#FDF2F4] rounded-[24px]">
                <h3 className="font-bold text-gray-800 mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-500 mb-4">Your payment information is encrypted and secure. We do not store your full card details.</p>
                <div className="flex items-center gap-3 opacity-60">
                    <CardIcon size={24} />
                    <div className="text-xs font-bold text-gray-400">Powered by Stripe</div>
                </div>
            </div>
        </div>
    );
}
