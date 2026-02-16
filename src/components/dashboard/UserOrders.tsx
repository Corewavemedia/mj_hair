import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import promotionImg from "../../assets/hero-image.svg";

export default function UserOrders({ orders, stats }: any) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Pagination Logic
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];
    const totalPages = orders ? Math.ceil(orders.length / itemsPerPage) : 0;

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Calculate page range to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-700">{stat.label}</h3>
                            <button
                                onClick={() => alert("Period filter coming soon!")}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Filter size={16} />
                            </button>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                            {stat.change && (
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                                    {stat.change}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-[#861134] to-[#EF2460] rounded-[24px] py-6 px-2 lg:px-16 text-white relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-4 justify-between">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl shadow-sm overflow-hidden">
                        <img src={promotionImg} alt="" className="object-cover" />
                    </div>
                    <h2 className="text-lg lg:text-2xl font-[ADLaM_Display] leading-tight">
                        Get Quality Hairs Starting From £200
                    </h2>
                    <Link to="/shop" className="bg-[#56041c] text-white text-center px-2.5 md:px-6 py-1 md:py-2.5 rounded-xl md:rounded-full text-xs md:text-sm font-bold border border-white/20 hover:bg-black/40 transition inline-block">
                        Shop Now
                    </Link>
                </div>
                {/* Abstract Shapes or Image */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 transform origin-bottom-right"></div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-800">Recent Orders</h3>
                    <div className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">{Math.min(indexOfFirstOrder + 1, orders?.length || 0)}</span> - <span className="font-bold text-gray-900">{Math.min(indexOfLastOrder, orders?.length || 0)}</span> of <span className="font-bold text-gray-900">{orders?.length || 0}</span>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                <th className="pb-4 pl-4">Product(s)</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4 text-right">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {currentOrders.map((order: any, i: number) => (
                                <tr key={i} className="group hover:bg-pink-50/50 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex flex-col">
                                            {order.items.map((item: any, idx: number) => (
                                                <span key={idx} className="font-bold text-gray-800 block">
                                                    {item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${order.orderStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            <span className={`${order.orderStatus === 'completed' ? 'text-green-500' : 'text-yellow-500'} font-bold capitalize`}>{order.orderStatus}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-right font-bold text-gray-900">£{order.totalPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                            {(!orders || orders.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#EF2460] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center
                                        ${currentPage === page
                                            ? "bg-[#EF2460] text-white shadow-md shadow-pink-200"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#EF2460] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
