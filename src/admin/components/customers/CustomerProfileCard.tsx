import React from 'react';
import { Copy, Phone, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Customer } from '../../types/analytics';

interface CustomerProfileCardProps {
    customer: Customer;
    onClose: () => void;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ customer, onClose }) => {
    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full md:w-[380px] h-full bg-primary-background shadow-2xl overflow-y-auto flex flex-col shrink-0 font-sans p-6 relative"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
                <X size={20} />
            </button>

            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                    <img
                        src={customer.avatar || `https://ui-avatars.com/api/?name=${customer.name}&background=random`}
                        alt={customer.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[#0F172A]">{customer.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                        <button className="text-blue-500 hover:text-blue-600 transition-colors">
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Customer Info Inputs */}
            <div className="mb-6 space-y-4">
                <p className="text-sm font-medium text-gray-400">Customer Info</p>

                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-background rounded-lg">
                    <Phone size={18} className="text-[#0F172A]" />
                    <span className="text-gray-600 text-sm font-medium">{customer.phone}</span>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-background rounded-lg">
                    <MapPin size={18} className="text-[#0F172A]" />
                    <span className="text-gray-600 text-sm font-medium">{customer.location || '123 Main St, New York, USA'}</span>
                </div>
            </div>

            {/* Last Order Details */}
            <div className="mb-8 space-y-2">
                <p className="text-sm font-medium text-gray-400">Last Order Details</p>
                {/* Note: We don't have the last ordered product name in the Customer object, so removing or using placeholder */}
                <p className="text-gray-600 font-medium">Order: <span className="text-gray-800">Latest Order</span></p>
                <p className="text-gray-600 font-medium">Last purchase: <span className="text-gray-800">{new Date(customer.lastOrderDate).toLocaleDateString()}</span></p>
            </div>

            {/* Order Overview Stats */}
            <div className="mb-8">
                <p className="text-sm font-medium text-gray-400 mb-4">Order overview</p>
                <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-secondary-background rounded-xl flex flex-col items-center justify-center p-2 text-center">
                        <p className="text-2xl font-bold text-[#0F172A]">{customer.totalOrders}</p>
                        <p className="text-xs font-medium text-purple-500 mt-1">Orders</p>
                    </div>
                    <div className="aspect-square bg-secondary-background rounded-xl flex flex-col items-center justify-center p-2 text-center">
                        <p className="text-2xl font-bold text-[#0F172A]">${customer.totalSpent.toLocaleString()}</p>
                        <p className="text-xs font-medium text-green-500 mt-1">Total Spend</p>
                    </div>
                    <div className="aspect-square bg-secondary-background rounded-xl flex flex-col items-center justify-center p-2 text-center">
                        <p className="text-2xl font-bold text-[#0F172A]">${Math.round(customer.totalSpent / Math.max(customer.totalOrders, 1))}</p>
                        <p className="text-xs font-medium text-red-500 mt-1">Average Spend</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
