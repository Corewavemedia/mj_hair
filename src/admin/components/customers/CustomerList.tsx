import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerProfileCard } from './CustomerProfileCard';
import type { Customer } from '../../types/analytics';

interface CustomerListProps {
    customers: Customer[];
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const profileRef = useRef<HTMLDivElement>(null);

    // Pagination Logic
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Scroll to profile card when it opens
    useEffect(() => {
        if (selectedCustomer && profileRef.current) {
            setTimeout(() => {
                profileRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);
        }
    }, [selectedCustomer]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 relative items-start overflow-hidden font-sans">
            <motion.div
                layout
                className="flex-1 min-w-0 bg-primary-background rounded-2xl shadow-sm flex flex-col"
            >
                {/* Header */}
                <div className="p-6">
                    <h2 className="text-lg font-bold text-text-primary">Customer Details</h2>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-scroll md:overflow-x-auto block max-w-[90vw] md:max-w-none">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="bg-text-primary/15 text-left">
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider">Customer Id</th>
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider">Name</th>
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider">Phone</th>
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider text-center">Total Orders</th>
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider">Total Spend</th>
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider">Date of last order</th>
                                <th className="py-4 px-6 text-xs font-bold text-text-primary uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {currentCustomers.length > 0 ? (
                                currentCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className={`cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? 'bg-text-primary/5' : 'hover:bg-text-primary/10'}`}
                                    >
                                        <td className="py-4 px-6 text-sm font-medium text-text-secondary whitespace-nowrap">{customer.customerId}</td>
                                        <td className="py-4 px-6 text-sm text-text-primary whitespace-nowrap">{customer.name}</td>
                                        <td className="py-4 px-6 text-sm text-text-primary whitespace-nowrap">{customer.phone}</td>
                                        <td className="py-4 px-6 text-sm text-text-primary text-center whitespace-nowrap">{customer.totalOrders}</td>
                                        <td className="py-4 px-6 text-sm text-text-primary whitespace-nowrap">£{customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        <td className="py-4 px-6 text-sm text-text-primary whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${customer.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {new Date(customer.lastOrderDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <MessageSquare size={18} />
                                                </button>
                                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-text-secondary">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 flex items-center justify-between">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer ${currentPage === i + 1
                                        ? 'bg-[#B9DDBF] text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Profile Card Container with Sticky & Scroll Ref */}
            <div
                ref={profileRef}
                className="sticky top-6 self-start scroll-mt-24 z-10"
            >
                <AnimatePresence>
                    {selectedCustomer && (
                        <CustomerProfileCard
                            customer={selectedCustomer}
                            onClose={() => setSelectedCustomer(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
