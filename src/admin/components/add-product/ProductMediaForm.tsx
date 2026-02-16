import React, { useState, useRef } from 'react';
import { Image, X, Plus, ChevronDown, RotateCcw } from 'lucide-react';
import type { ImageItem } from "../../pages/AddProducts";

interface ProductMediaFormProps {
    images: ImageItem[]; setImages: (val: ImageItem[]) => void;
    mainImage: ImageItem | null; setMainImage: (val: ImageItem | null) => void;
    categories: string[]; setCategories: (val: string[]) => void;
    tags: string[]; setTags: (val: string[]) => void;
    selectedCategory: string; setSelectedCategory: (val: string) => void;
    selectedTags: string[]; setSelectedTags: (val: string[]) => void;
}

export const ProductMediaForm: React.FC<ProductMediaFormProps> = ({
    images, setImages,
    mainImage, setMainImage,
    categories, setCategories,
    tags, setTags,
    selectedCategory, setSelectedCategory,
    selectedTags, setSelectedTags
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const newItem: ImageItem = { url: imageUrl, file };
            setImages([...images, newItem]);
            setMainImage(newItem);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
        if (mainImage?.storageId === images[indexToRemove]?.storageId) {
            // If we removed the main image, set main image to the first available, or null
            setMainImage(newImages.length > 0 ? newImages[0] : null);
        }
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setSelectedCategory(newCategory);
            setNewCategory('');
            setIsCategoryOpen(false);
        }
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            if (!selectedTags.includes(newTag)) {
                setSelectedTags([...selectedTags, newTag]);
            }
            setNewTag('');
            setIsTagOpen(false);
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="bg-primary-background p-8 rounded-2xl shadow-sm font-sans h-full">
            <h2 className="text-xl font-bold text-text-primary mb-6">Upload Product Image</h2>

            <label className="block text-xs font-bold text-text-primary mb-4">Product Image</label>

            {/* Main Preview Area */}
            <div className="border border-text-primary/20 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center relative min-h-[300px] group">
                {mainImage ? (
                    <img
                        src={mainImage.url}
                        alt="Product Preview"
                        className="w-[180px] object-contain mb-4"
                    />
                ) : (
                    <div className="text-gray-400 text-sm mb-4">
                        No image selected
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="absolute bottom-4 left-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-background rounded-xl text-xs font-bold text-text-primary transition-colors shadow-sm"
                    >
                        <Image size={16} className="text-gray-500" />
                        Browse
                    </button>
                </div>

                {mainImage && (
                    <div className="absolute bottom-4 right-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-background rounded-xl text-xs font-bold text-text-primary transition-colors shadow-sm"
                        >
                            <RotateCcw size={14} />
                            Replace
                        </button>
                    </div>
                )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-4 mb-8 flex-wrap">
                {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-xl flex items-center justify-center border border-text-primary/20 shadow-sm cursor-pointer hover:border-text-primary" onClick={() => setMainImage(img)}>
                        <img
                            src={img.url}
                            className="w-12 h-16 object-contain"
                            alt={`thumb-${index}`}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {/* Add Image Button */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-56 h-24 border-2 border-dashed border-text-primary/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-text-primary/10 transition-colors group"
                >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform">
                        <Plus size={14} />
                    </div>
                    <span className="text-xs font-bold text-primary">Add Image</span>
                </div>
            </div>

            <h2 className="text-xl font-bold text-text-primary mb-6">Categories</h2>

            {/* Product Categories Dropdown */}
            <div className="mb-6 relative">
                <label className="block text-xs font-bold text-text-primary mb-2">Product Categories</label>
                <div
                    className="w-full p-4 bg-text-primary/10 rounded-xl flex items-center justify-between cursor-pointer transition-colors shadow-sm"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                    <span className={`text-sm font-bold ${selectedCategory ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {selectedCategory || 'Select your product'}
                    </span>
                    <ChevronDown size={18} className="text-text-primary" />
                </div>

                {isCategoryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-secondary-background rounded-xl shadow-lg z-10 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                            {categories.map(cat => (
                                <div
                                    key={cat}
                                    className="px-4 py-3 hover:bg-primary-background cursor-pointer text-sm font-medium text-text-primary transition-colors"
                                    onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-secondary-background border-t border-gray-200 dark:border-gray-700">
                            <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5 px-1">Add New Category</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Category Name"
                                    className="flex-1 px-3 py-2 bg-primary-background rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                                />
                                <button
                                    onClick={addCategory}
                                    disabled={!newCategory}
                                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary/20"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Tags Dropdown */}
            <div className="mb-8 relative">
                <label className="block text-xs font-bold text-text-primary mb-2">Product Tags</label>

                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedTags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 text-primary text-xs font-bold rounded-lg border border-primary/40">
                                {tag}
                                <X
                                    size={12}
                                    className="cursor-pointer hover:text-red-500"
                                    onClick={() => toggleTag(tag)}
                                />
                            </span>
                        ))}
                    </div>
                )}

                <div
                    className="w-full p-4 bg-text-primary/10 rounded-xl flex items-center justify-between cursor-pointer transition-colors shadow-sm"
                    onClick={() => setIsTagOpen(!isTagOpen)}
                >
                    <span className="text-sm font-bold text-text-secondary">
                        Select tags...
                    </span>
                    <ChevronDown size={18} className="text-text-primary" />
                </div>

                {isTagOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-secondary-background rounded-xl shadow-lg z-10 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                            {tags.map(tag => (
                                <div
                                    key={tag}
                                    className={`px-4 py-3 hover:bg-primary-background cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${selectedTags.includes(tag) ? 'text-primary bg-primary/5' : 'text-text-primary'}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                    {selectedTags.includes(tag) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-secondary-background border-t border-gray-200 dark:border-gray-700">
                            <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5 px-1">Add New Tag</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Tag Name"
                                    className="flex-1 px-3 py-2 bg-primary-background rounded-xl text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                />
                                <button
                                    onClick={addTag}
                                    disabled={!newTag}
                                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary/20"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Select Your Color */}
            <div>
                <label className="block text-xs font-bold text-text-primary mb-3">Select your color</label>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-lg bg-[#DDF0C8] hover:scale-110 transition-transform focus:ring-2 ring-offset-2 ring-[#DDF0C8] dark:ring-offset-black"></button>
                    <button className="w-10 h-10 rounded-lg bg-[#F3D7DC] hover:scale-110 transition-transform focus:ring-2 ring-offset-2 ring-[#F3D7DC] dark:ring-offset-black"></button>
                    <button className="w-10 h-10 rounded-lg bg-[#DCE4E9] hover:scale-110 transition-transform focus:ring-2 ring-offset-2 ring-[#DCE4E9] dark:ring-offset-black"></button>
                    <button className="w-10 h-10 rounded-lg bg-[#F2ECD1] hover:scale-110 transition-transform focus:ring-2 ring-offset-2 ring-[#F2ECD1] dark:ring-offset-black"></button>
                    <button className="w-10 h-10 rounded-lg bg-[#4B5057] hover:scale-110 transition-transform focus:ring-2 ring-offset-2 ring-[#4B5057] dark:ring-offset-black"></button>
                </div>
            </div>
        </div>
    );
};
