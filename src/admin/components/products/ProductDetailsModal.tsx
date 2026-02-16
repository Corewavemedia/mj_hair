import React from 'react';
import { X, Package, Calendar, Tag, Archive, CheckCircle, AlertCircle } from 'lucide-react';
import type { Product } from '../../types/analytics';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-primary-background rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-primary-background border-b border-gray-100/50 backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">Product Details</h2>
                        <p className="text-sm text-text-secondary mt-1">ID: {product._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-text-primary/15 rounded-md transition-colors text-text-secondary hover:text-text-primary"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column: Images */}
                        <div className="space-y-6">
                            <div className="aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                {product.mainImage ? (
                                    <img
                                        src={product.mainImage}
                                        alt={product.productName}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <Package size={64} strokeWidth={1.5} />
                                        <p className="text-sm mt-2">No main image</p>
                                    </div>
                                )}
                            </div>

                            {product.images && product.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img, idx) => (
                                        <div key={idx} className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-blue-500 transition-colors">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-bold text-text-primary mb-2">{product.productName}</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${product.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {product.status === 'published' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                        <span className="capitalize">{product.status || 'Draft'}</span>
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${product.stockStatus === 'In Stock'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-orange-50 text-orange-700'
                                        }`}>
                                        <Archive size={14} />
                                        {product.stockStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Pricing & Stock</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-text-secondary mb-1">Price</p>
                                        <p className="text-2xl font-bold text-text-primary font-mono">£{product.productPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-1">Discounted</p>
                                        <p className="text-2xl font-bold text-text-primary font-mono">
                                            {product.discountedPrice ? `£${product.discountedPrice}` : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-1">Stock Quantity</p>
                                        <p className="text-lg font-semibold text-text-primary">
                                            {product.isUnlimited ? 'Unlimited' : product.stockQuantity || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-1">Tax Included</p>
                                        <p className="text-lg font-semibold text-text-primary">
                                            {product.taxIncluded ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Description</h4>
                                <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed p-2">
                                    {product.productDescription || <span className="text-text-secondary italic">No description provided.</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Organization</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-text-secondary mb-1">Category</p>
                                            <div className="flex items-center gap-2 text-text-secondary font-medium">
                                                <Tag size={16} className="text-blue-500" />
                                                {product.selectedCategory || 'Uncategorized'}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary mb-1">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.selectedTags && product.selectedTags.length > 0 ? (
                                                    product.selectedTags.map((tag, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-text-primary/10 rounded-md text-xs text-text-primary">
                                                            #{tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-text-secondary">-</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Schedule</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-text-secondary mb-1">Start Date</p>
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <Calendar size={16} className="text-text-primary" />
                                                <span className="text-sm">{product.startDate || 'Immediate'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary mb-1">End Date</p>
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <Calendar size={16} className="text-text-primary" />
                                                <span className="text-sm">{product.endDate || 'No Expiry'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
