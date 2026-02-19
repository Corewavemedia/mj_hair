import React, { useState } from 'react';
import { ChevronDown, Eye, Edit2, Trash2, AlertTriangle, Share2 } from 'lucide-react';
import { useAnalyticsStore } from '../../context/AnalyticsContext';
import type { Product } from '../../types/analytics';
import { ProductDetailsModal } from './ProductDetailsModal';
import { ShareProductModal } from './ShareProductModal';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export const ProductTable: React.FC = () => {
    const { products, loading } = useAnalyticsStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Action States
    const [viewProduct, setViewProduct] = useState<Product | null>(null);
    const [shareProduct, setShareProduct] = useState<Product | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const deleteProduct = useMutation(api.products.deleteProduct);

    if (loading) {
        return <div className="p-8 text-center text-text-secondary">Loading products...</div>;
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || product.status === statusFilter || product.stockStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteProduct({ id: deleteId as Id<"products"> });
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product");
        }
        setIsDeleting(false);
    };

    return (
        <>
            <div className="bg-primary-background rounded-2xl shadow-sm overflow-hidden font-sans flex-1 mt-6">
                <div className="p-6 flex justify-between items-center rounded-t-2xl">
                    <h3 className="text-lg font-bold text-text-primary">All Products</h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search product..."
                            className="w-full pl-6 pr-10 py-3 bg-text-primary/10 rounded-xl text-xs text-text-secondary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-gray-100 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="px-4 py-2 text-text-primary bg-text-primary/15 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option className='text-primary-background font-bold' value="All">All Status</option>
                            <option className='text-primary-background font-bold' value="published">Published</option>
                            <option className='text-primary-background font-bold' value="draft">Draft</option>
                            <option className='text-primary-background font-bold' value="In Stock">In Stock</option>
                            <option className='text-primary-background font-bold' value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
                <div className='overflow-x-auto'>

                    <table className="w-full">
                        <thead>
                            <tr className="bg-text-primary/15">
                                <th className="py-4 pl-6 text-left text-sm font-bold text-text-primary min-w-[200px]">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        Product <ChevronDown size={14} className="text-text-secondary" />
                                    </div>
                                </th>
                                <th className="py-4 text-left text-sm font-bold text-text-primary">SKU</th>
                                <th className="py-4 text-left text-sm font-bold text-text-primary">Category</th>
                                <th className="py-4 text-left text-sm font-bold text-text-primary">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        Stock <ChevronDown size={14} className="text-text-secondary" />
                                    </div>
                                </th>
                                <th className="py-4 text-left text-sm font-bold text-text-primary">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        Price <ChevronDown size={14} className="text-text-secondary" />
                                    </div>
                                </th>
                                <th className="py-4 text-left text-sm font-bold text-text-primary">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        Status <ChevronDown size={14} className="text-text-secondary" />
                                    </div>
                                </th>
                                <th className="py-4 text-left text-sm font-bold text-text-primary">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        Added <ChevronDown size={14} className="text-text-secondary" />
                                    </div>
                                </th>
                                <th className="py-4 text-center text-sm font-bold text-text-primary pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-text-primary/10 transition-colors">
                                    <td className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0">
                                                {product.mainImage ? (
                                                    <img src={product.mainImage} alt={product.productName} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <p className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg text-xs text-gray-500">No Img</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{product.productName}</p>
                                                <p className="text-xs text-text-secondary">{product.variants || 'No Variants'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm font-bold text-primary cursor-pointer hover:underline">
                                        {product._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="py-4 text-sm font-medium text-[#4B5563]">
                                        {product.selectedCategory || 'Uncategorized'}
                                    </td>
                                    <td className="py-4 text-sm font-medium text-[#4B5563]">
                                        {product.isUnlimited ? 'Unlimited' : product.stockQuantity}
                                    </td>
                                    <td className="py-4 text-sm font-medium text-[#4B5563]">£{product.productPrice}</td>
                                    <td className="py-4">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${product.stockStatus === 'Out of Stock' ? 'bg-[#FFF4E4] text-[#F97316]' : product.status === 'published' ? 'bg-[#DEF9EC] text-[#10B981]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}
                                        >
                                            {product.status === 'published' ? 'Published' : product.status === 'draft' ? 'Draft' : product.stockStatus}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm font-medium text-[#4B5563]">
                                        {new Date(product._creationTime).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-4 pr-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setViewProduct(product)}
                                                className="text-text-secondary hover:text-[#3B82F6] transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => setShareProduct(product)}
                                                className="text-text-secondary hover:text-green-500 transition-colors"
                                                title="Share Product"
                                            >
                                                <Share2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                className="text-text-secondary hover:text-[#3B82F6] transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(product._id)}
                                                className="text-text-secondary hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Product Modal */}
            <ProductDetailsModal
                isOpen={!!viewProduct}
                onClose={() => setViewProduct(null)}
                product={viewProduct}
            />

            {/* Share Product Modal */}
            <ShareProductModal
                isOpen={!!shareProduct}
                onClose={() => setShareProduct(null)}
                product={shareProduct}
            />

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

