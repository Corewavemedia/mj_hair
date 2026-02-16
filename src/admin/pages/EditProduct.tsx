import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BasicDetailsForm } from '../components/add-product/BasicDetailsForm';
import { ProductMediaForm } from '../components/add-product/ProductMediaForm';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import type { Id } from "../../../convex/_generated/dataModel";

export interface ImageItem {
    storageId?: string;
    url: string;
    file?: File;
}

export const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch existing product
    const product = useQuery(api.products.getProduct, id ? { id: id as Id<"products"> } : "skip");

    // Basic Details State
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [isUnlimited, setIsUnlimited] = useState(true);
    const [taxIncluded, setTaxIncluded] = useState(true);
    const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock'>('In Stock');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState<'published' | 'draft'>('draft');

    // Media & Categories State
    const [images, setImages] = useState<ImageItem[]>([]);
    const [mainImage, setMainImage] = useState<ImageItem | null>(null);
    const categoriesData = useQuery(api.products.getCategories);
    const createCategory = useMutation(api.products.addCategory);

    const categories = categoriesData ? categoriesData.map((c: { name: string }) => c.name) : [];

    const setCategories = (newCats: string[]) => {
        const currentSet = new Set(categories);
        const added = newCats.find(c => !currentSet.has(c));
        if (added) {
            createCategory({ name: added });
        }
    };

    // Tags State
    const tagsData = useQuery(api.products.getTags);
    const createTag = useMutation(api.products.addTag);
    const tags = tagsData ? tagsData.map((t: { name: string }) => t.name) : [];

    const setTags = (newTags: string[]) => {
        const currentSet = new Set(tags);
        const added = newTags.find(t => !currentSet.has(t));
        if (added) {
            createTag({ name: added });
        }
    };
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const updateProduct = useMutation(api.products.updateProduct);
    const generateUploadUrl = useMutation(api.products.generateUploadUrl);

    const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    // Populate state when product data loads
    useEffect(() => {
        if (product) {
            setProductName(product.productName);
            setProductDescription(product.productDescription);
            setProductPrice(product.productPrice);
            setDiscountedPrice(product.discountedPrice || '');
            // setCouponCode(product.couponCode || '');
            setStockQuantity(product.stockQuantity);
            setIsUnlimited(product.isUnlimited);
            setTaxIncluded(product.taxIncluded);
            setStockStatus(product.stockStatus as 'In Stock' | 'Out of Stock');
            setStartDate(product.startDate);
            setEndDate(product.endDate);
            setStatus(product.status as 'published' | 'draft');
            setSelectedCategory(product.selectedCategory);
            setSelectedTags(product.selectedTags || []);

            if (product.images && (product as any).imageStorageIds) {
                const imgIds = (product as any).imageStorageIds as string[];
                setImages(product.images.map((url: string, index: number) => ({
                    url,
                    storageId: imgIds[index]
                })));
            } else if (product.images) {
                setImages(product.images.map((url: string) => ({ url })));
            }

            if (product.mainImage) {
                // Try to find main image in images array to get storageId, or use mainImageStorageId if available
                const mainId = (product as any).mainImageStorageId;
                setMainImage({
                    url: product.mainImage,
                    storageId: mainId
                });
            }
        }
    }, [product]);

    const handleSave = async () => {
        if (!id) return;

        const newErrors: { name?: string; price?: string } = {};
        if (!productName) newErrors.name = 'Product name is required.';
        if (!productPrice) newErrors.price = 'Product price is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Upload images first
            const uploadedImages = await Promise.all(images.map(async (img) => {
                if (img.storageId) return img.storageId;
                if (img.file) {
                    const postUrl = await generateUploadUrl();
                    const result = await fetch(postUrl, {
                        method: "POST",
                        headers: { "Content-Type": img.file.type },
                        body: img.file,
                    });
                    if (!result.ok) throw new Error(`Upload failed: ${result.statusText}`);
                    const { storageId } = await result.json();
                    return storageId;
                }
                return null;
            }));

            const validImageIds = uploadedImages.filter((id): id is string => id !== null);

            let mainImageId = "";
            if (mainImage) {
                if (mainImage.storageId) {
                    mainImageId = mainImage.storageId;
                } else if (mainImage.file) {
                    const postUrl = await generateUploadUrl();
                    const result = await fetch(postUrl, {
                        method: "POST",
                        headers: { "Content-Type": mainImage.file.type },
                        body: mainImage.file,
                    });
                    if (!result.ok) throw new Error(`Upload failed: ${result.statusText}`);
                    const { storageId } = await result.json();
                    mainImageId = storageId;
                }
            }

            const productData = {
                id: id as Id<"products">,
                productName, productDescription, productPrice, discountedPrice, taxIncluded,
                startDate, endDate, stockQuantity, isUnlimited, stockStatus,
                images: validImageIds,
                mainImage: mainImageId,
                selectedCategory,
                selectedTags: selectedTags,
                status
            };

            await updateProduct(productData);
            navigate('/admin/products');
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product.");
        }
        setIsLoading(false);
    };

    if (product === undefined) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading product...</p>
                </div>
            </MainLayout>
        );
    }

    if (product === null) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full flex-col gap-4">
                    <p className="text-gray-500">Product not found.</p>
                    <button onClick={() => navigate('/admin/products')} className="text-text-primary hover:underline">Back to Products</button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col gap-1 pb-8 h-full">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row justify-between md:items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-text-primary">Edit Product</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status Toggle */}
                        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-gray-100 shadow-sm">
                            <span className={`text-sm font-medium ${status === 'draft' ? 'text-gray-900' : 'text-gray-400'}`}>Draft</span>
                            <button
                                onClick={() => setStatus(prev => prev === 'published' ? 'draft' : 'published')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${status === 'published' ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${status === 'published' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-medium ${status === 'published' ? 'text-emerald-600' : 'text-gray-400'}`}>Published</span>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-blue-500/20 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    <BasicDetailsForm
                        errors={errors} setErrors={setErrors}
                        isLoading={isLoading}
                        productName={productName} setProductName={setProductName}
                        productDescription={productDescription} setProductDescription={setProductDescription}
                        productPrice={productPrice} setProductPrice={setProductPrice}
                        discountedPrice={discountedPrice} setDiscountedPrice={setDiscountedPrice}
                        couponCode={couponCode} setCouponCode={setCouponCode}
                        stockQuantity={stockQuantity} setStockQuantity={setStockQuantity}
                        isUnlimited={isUnlimited} setIsUnlimited={setIsUnlimited}
                        taxIncluded={taxIncluded} setTaxIncluded={setTaxIncluded}
                        stockStatus={stockStatus} setStockStatus={setStockStatus}
                        startDate={startDate} setStartDate={setStartDate}
                        endDate={endDate} setEndDate={setEndDate}
                        onPublish={() => { }} // Not used here
                        onSaveDraft={() => { }} // Not used here
                        hideActions={true} // Add this prop to BasicDetailsForm to hide original buttons if needed, or just let them render but we hide the header in AddProductHeader. Wait, BasicDetailsForm wraps the form fields. The buttons were in AddProductHeader. So we are fine.
                    />
                    <ProductMediaForm
                        images={images} setImages={setImages}
                        mainImage={mainImage} setMainImage={setMainImage}
                        categories={categories} setCategories={setCategories}
                        tags={tags} setTags={setTags}
                        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                        selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                    />
                </div>
            </div>
        </MainLayout>
    );
};
