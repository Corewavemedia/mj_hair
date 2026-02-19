import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siFacebook, siX, siWhatsapp, siPinterest } from "simple-icons/icons";
import type { Product } from '../../types/analytics';

interface ShareProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const SocialIcon = ({ icon, href, color }: { icon: { hex: string, path: string }, href: string, color?: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full bg-secondary-background hover:bg-text-primary/10 transition-colors flex items-center justify-center border border-text-primary/10"
        style={{ color: color || `#${icon.hex}` }}
    >
        <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d={icon.path} />
        </svg>
    </a>
);

export const ShareProductModal: React.FC<ShareProductModalProps> = ({ isOpen, onClose, product }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !product) return null;

    const shareUrl = `${window.location.origin}/shop/${product._id}`;
    const title = product.productName;
    const image = product.mainImage;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-primary-background rounded-2xl w-full max-w-md shadow-2xl p-6 relative border border-text-primary/10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 hover:bg-text-primary/10 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-text-primary mb-2">Share Product</h3>
                        <p className="text-text-secondary text-sm mb-6">Share this product with your customers.</p>

                        <div className="flex gap-4 justify-center mb-8">
                            <SocialIcon
                                icon={siWhatsapp}
                                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${title}: ${shareUrl}`)}`}
                            />
                            <SocialIcon
                                icon={siFacebook}
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            />
                            <SocialIcon
                                icon={siX}
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title}`)}&url=${encodeURIComponent(shareUrl)}`}
                                color="var(--color-text-primary)"
                            />
                            <SocialIcon
                                icon={siPinterest}
                                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(image || '')}&description=${encodeURIComponent(title)}`}
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-text-primary/10 p-3 rounded-xl border border-text-primary/10">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="bg-transparent border-none text-sm text-text-primary flex-1 focus:ring-0 truncate outline-none"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-primary-background rounded-lg shadow-sm hover:bg-secondary-background transition-colors text-text-primary border border-text-primary/10"
                                title="Copy Link"
                            >
                                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
