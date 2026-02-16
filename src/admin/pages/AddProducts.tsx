import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { AddProductHeader } from '../components/add-product/AddProductHeader';
import { BasicDetailsForm } from '../components/add-product/BasicDetailsForm';
import { ProductMediaForm } from '../components/add-product/ProductMediaForm';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


export interface ImageItem {
    storageId?: string;
    url: string;
    file?: File;
}

export interface ProductData {
    // Basic Details
    productName: string;
    productDescription: string;
    productPrice: string;
    discountedPrice: string;
    couponCode: string;
    taxIncluded: boolean;
    startDate: string;
    endDate: string;
    stockQuantity: string;
    isUnlimited: boolean;
    stockStatus: 'In Stock' | 'Out of Stock';

    // Media & Categories
    images: string[];
    mainImage: string;
    categories: string[];
    tags: string[];
    selectedCategory: string;
    selectedTags: string[];
    status?: 'published' | 'draft';
}

import { useNavigate } from 'react-router-dom';

export const AddProducts: React.FC = () => {
    const navigate = useNavigate();
    // Basic Details State
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('99');
    const [couponCode, setCouponCode] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [isUnlimited, setIsUnlimited] = useState(true);
    const [taxIncluded, setTaxIncluded] = useState(true);
    const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock'>('In Stock');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

    const addProduct = useMutation(api.products.addProduct);
    const generateUploadUrl = useMutation(api.products.generateUploadUrl);

    const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (status: 'published' | 'draft') => {
        const newErrors: { name?: string; price?: string } = {};
        if (!productName) newErrors.name = 'Product name is required.';
        if (!productPrice) newErrors.price = 'Product price is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        let finalSelectedTags = [...selectedTags];
        if (status === 'draft') {
            if (!finalSelectedTags.includes('drafted')) {
                finalSelectedTags.push('drafted');
            }
        }

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
                // Find main image in the images array to reuse the uploaded ID
                const index = images.findIndex(img => img.url === mainImage.url);
                if (index !== -1) {
                    mainImageId = validImageIds[index];
                } else if (mainImage.storageId) {
                    mainImageId = mainImage.storageId;
                } else if (mainImage.file) {
                    // Fallback if main image is not in the array (shouldn't happen with current UI)
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
                productName, productDescription, productPrice, discountedPrice, taxIncluded,
                startDate, endDate, stockQuantity, isUnlimited, stockStatus,
                images: validImageIds,
                mainImage: mainImageId,
                selectedCategory,
                selectedTags: finalSelectedTags,
                status
            };
            console.log(`Saving Product (${status}):`, productData);

            await addProduct(productData);
            alert(`Product ${status === 'published' ? 'published' : 'saved to draft'} successfully!`);
            navigate('/admin/products');
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. Check console for details.");
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col gap-1 pb-8 h-full">
                {/* Header Actions */}
                <AddProductHeader
                    onPublish={() => handleSave('published')}
                    onSaveDraft={() => handleSave('draft')}
                    isLoading={isLoading}
                />

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
                        onPublish={() => handleSave('published')}
                        onSaveDraft={() => handleSave('draft')}
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
