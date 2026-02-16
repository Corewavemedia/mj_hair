
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface OrderPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderPolicyModal({ isOpen, onClose }: OrderPolicyModalProps) {
    const policies = [
        "All wig are new and carefully inspected before delivery",
        "No refunds after wig lace is cut or worn",
        "Wigs can only be returned within 24 hours, unworn with original packaging",
        "Delivery cost is non-refundable",
        "Your order can only been sent after payment is made",
        "If your payment is by installment ensure you pay within 2months, if after 2months you still don't complete your payment your order might be sold and you will be asked to change with another unit"
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            className="bg-white w-full max-w-lg rounded-3xl pb-4 overflow-hidden shadow-2xl pointer-events-auto flex flex-col h-max max-h-[95vh]"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="relative pt-8 pb-4 text-center bg-white shrink-0">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1.5 hover:bg-black/10 rounded-lg hover:text-black text-black transition"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="font-['Poppins'] font-extrabold text-3xl text-[#b02e6c] uppercase tracking-wide">
                                    Order Policy
                                </h2>
                            </div>
                            <div className="px-4 pb-6 space-y-6 h-max">
                                {policies.map((policy, index) => (
                                    <div key={index} className="flex relative items-stretch min-h-[60px] mt-4">
                                        <div className="relative z-20 flex-shrink-0 h-12 w-20 bg-[#b02e6c] flex items-center justify-center rounded-r-full pr-4 shadow-lg -rotate-20 origin-bottom-right -mr-6 -mt-4">
                                            <span className="font-bold text-3xl text-white">{index + 1}</span>
                                        </div>
                                        <div className="relative flex-grow flex items-center justify-between gap-4 overflow-hidden bg-[#5e3a07] rounded-r-full pl-6 shadow-md z-10">
                                            <p className="text-white text-md font-['bree_serif'] font-bold leading-tight relative z-10 py-2">
                                                {policy}
                                            </p>
                                            <div className="flex-shrink-0 h-full w-6 bg-[#b02e6c] z-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white shrink-0">
                                <div className="bg-[#99004d] p-3 text-center">
                                    <h3 className="font-['Poppins'] font-bold text-2xl text-white uppercase tracking-wider">
                                        Return Guild
                                    </h3>
                                </div>
                                <div className="p-5 bg-white">
                                    <ul className="space-y-3 text-black text-sm font-['Manrope'] font-medium">
                                        {[
                                            "Order within UK must be returned within 48 hours in good condition",
                                            "International order must be returned within 7 days"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="mt-1.5 w-2 h-2 bg-[#99004d] rotate-45 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
