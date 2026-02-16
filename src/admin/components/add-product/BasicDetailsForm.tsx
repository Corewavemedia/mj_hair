import React from 'react';
import { Save } from 'lucide-react';

interface BasicDetailsFormProps {
    errors?: { name?: string; price?: string }; setErrors?: (val: { name?: string; price?: string }) => void;
    productName: string; setProductName: (val: string) => void;
    productDescription: string; setProductDescription: (val: string) => void;
    productPrice: string; setProductPrice: (val: string) => void;
    discountedPrice: string; setDiscountedPrice: (val: string) => void;
    couponCode: string; setCouponCode: (val: string) => void;
    stockQuantity: string; setStockQuantity: (val: string) => void;
    isUnlimited: boolean; setIsUnlimited: (val: boolean) => void;
    taxIncluded: boolean; setTaxIncluded: (val: boolean) => void;
    stockStatus: 'In Stock' | 'Out of Stock'; setStockStatus: (val: 'In Stock' | 'Out of Stock') => void;
    startDate: string; setStartDate: (val: string) => void;
    endDate: string; setEndDate: (val: string) => void;
    onPublish: () => void;
    onSaveDraft: () => void;
    isLoading?: boolean;
    hideActions?: boolean;
}

export const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
    errors, setErrors,
    productName, setProductName,
    productDescription, setProductDescription,
    productPrice, setProductPrice,
    discountedPrice, setDiscountedPrice,
    couponCode, setCouponCode,
    stockQuantity, setStockQuantity,
    isUnlimited, setIsUnlimited,
    taxIncluded, setTaxIncluded,
    stockStatus, setStockStatus,
    startDate, setStartDate,
    endDate, setEndDate,
    onPublish, onSaveDraft,
    isLoading,
    hideActions
}) => {
    const [isStockStatusOpen, setIsStockStatusOpen] = React.useState(false);

    return (
        <div className="bg-primary-background p-8 rounded-2xl shadow-sm font-sans h-full">
            <h2 className="text-xl font-bold text-text-primary mb-6">Basic Details</h2>

            {/* Product Name */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-text-primary mb-2">Product Name</label>
                <div className="relative">
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => {
                            setProductName(e.target.value);
                            if (errors?.name && setErrors) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Type name here..."
                        className="w-full p-4 bg-text-primary/10 rounded-xl text-sm font-medium text-text-primary outline-none transition-colors"
                    />
                    {errors?.name && (
                        <p className="mt-1 text-red-500 text-xs font-bold animate-pulse">{errors.name}</p>
                    )}
                </div>
            </div>

            {/* Product Description */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-text-primary mb-2">Product Description</label>
                <div className="relative">
                    <textarea
                        rows={5}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full p-4 bg-text-primary/10 rounded-xl text-sm font-medium text-text-primary text-[#F4F7FE] leading-relaxed outline-none transition-colors resize-none pb-12"
                    />
                </div>
            </div>

            {/* Pricing Section */}
            <h2 className="text-xl font-bold text-text-primary mb-4">Pricing</h2>
            <div className="mb-4">
                <label className="block text-xs font-bold text-text-primary mb-2">Product Price</label>
                <div className="w-full p-3 bg-text-primary/10 rounded-xl flex items-center">
                    <span className="text-text-secondary text-sm font-bold">£</span>
                    <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => {
                            setProductPrice(e.target.value);
                            if (errors?.price && setErrors) setErrors({ ...errors, price: undefined });
                        }}
                        placeholder="0.00"
                        className="w-full p-3 bg-transparent text-sm font-bold text-text-primary outline-none"
                    />
                </div>
                {errors?.price && (
                    <p className="mt-1 text-red-500 text-xs font-bold animate-pulse">{errors.price}</p>
                )}
            </div>
            {/* Discount & Tax */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-text-primary mb-2">Discounted Price <span className="text-text-secondary font-normal">(Optional)</span></label>
                            <div className="p-3 bg-text-primary/10 rounded-xl flex items-center gap-2">
                                <span className="text-green-600 font-bold text-sm">£</span>
                                <input
                                    type="number"
                                    value={discountedPrice}
                                    onChange={(e) => setDiscountedPrice(e.target.value)}
                                    className="w-full bg-transparent text-text-primary font-bold text-sm outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-text-primary mb-2">Coupon Code</label>
                            <div className="p-3 bg-text-primary/10 rounded-xl flex items-center justify-center">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Code"
                                    className="w-full bg-transparent text-text-primary font-bold text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-primary mb-2">Tax Included</label>
                    <div className="flex flex-col gap-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTaxIncluded(true)}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${taxIncluded ? 'bg-primary' : 'bg-gray-200'}`}>
                                {taxIncluded && <div className="w-2 h-2 rounded-full bg-white"></div>}
                            </div>
                            <span className="text-sm font-medium text-text-primary">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTaxIncluded(false)}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${!taxIncluded ? 'bg-primary' : 'bg-gray-200'}`}>
                                {!taxIncluded && <div className="w-2 h-2 rounded-full bg-white"></div>}
                            </div>
                            <span className="text-sm font-medium text-text-primary">No</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Expiration */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-text-primary mb-2">Expiration</label>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-text-secondary font-bold mb-1 ml-1">Start Date</label>
                        <div className="relative bg-text-primary/10 rounded-xl">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 text-sm font-medium text-text-primary outline-none rounded-xl"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary font-bold mb-1 ml-1">End Date</label>
                        <div className="relative bg-text-primary/10 rounded-xl">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 bg-transparent text-sm font-medium text-text-primary outline-none rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory */}
            <h2 className="text-xl font-bold text-text-primary mb-4">Inventory</h2>
            <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-text-primary mb-2">Stock Quantity</label>
                    <div className={`w-full p-3 bg-text-primary/10 rounded-xl text-sm font-medium text-text-primary ${isUnlimited ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="number"
                            placeholder="0"
                            disabled={isUnlimited}
                            value={isUnlimited ? '' : stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            className="w-full bg-transparent outline-none disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-text-primary mb-2">Stock Status</label>
                    <div className="relative">
                        <div
                            className="w-full p-3 bg-text-primary/10 rounded-xl flex justify-between items-center cursor-pointer"
                            onClick={() => setIsStockStatusOpen(!isStockStatusOpen)}
                        >
                            <span className="text-sm font-medium text-text-primary">{stockStatus}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isStockStatusOpen ? 'rotate-180' : ''} text-text-primary`}>
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {isStockStatusOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-secondary-background rounded-xl shadow-lg z-10 overflow-hidden">
                                <div
                                    className="p-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-text-primary"
                                    onClick={() => { setStockStatus('In Stock'); setIsStockStatusOpen(false); }}
                                >
                                    In Stock
                                </div>
                                <div
                                    className="p-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-text-primary"
                                    onClick={() => { setStockStatus('Out of Stock'); setIsStockStatusOpen(false); }}
                                >
                                    Out of Stock
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div
                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isUnlimited ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => setIsUnlimited(!isUnlimited)}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${isUnlimited ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm text-text-secondary font-medium">Unlimited</span>
            </div>

            {/* Bottom Actions */}
            {!hideActions && (
                <div className="flex gap-4 pt-4 mt-4">
                    <button
                        onClick={onSaveDraft}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-background text-text-primary rounded-xl text-sm font-bold hover:bg-text-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        {isLoading ? 'Saving...' : 'Save to draft'}
                    </button>
                    <button
                        onClick={onPublish}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Publishing...' : 'Publish Product'}
                    </button>
                </div>
            )}
        </div>
    );
};
