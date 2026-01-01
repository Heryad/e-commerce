'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Heart, Minus, Plus, ShoppingCart, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/src/context/LanguageContext';
import { useCart } from '@/src/context/CartContext';


interface Product {
    id: string;
    name: string;
    nameAr?: string;
    price: number;
    originalPrice?: number;
    images: string[];
    rating: number;
    reviews: number;
    colors?: string[];
    description?: string;
    category?: string;
}

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * QuickViewModal Component - Golden Yellow theme
 * Product quick view overlay with image gallery and add to cart
 */
export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const { language, t } = useLanguage();
    const { addToCart } = useCart();
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        setCurrentImage(0);
        setSelectedColor(0);
        setQuantity(1);
    }, [product]);

    if (!product) return null;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const defaultColors = ['#1a1a1a', '#6b7280', '#d4af37', '#c0c0c0'];
    const colors = product.colors || defaultColors;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto md:overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            aria-label="Close quick view"
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image gallery */}
                            <div className="relative bg-white p-5 sm:p-8">
                                {discount > 0 && (
                                    <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full z-10">
                                        -{discount}%
                                    </span>
                                )}

                                <div className="relative aspect-square mt-8 md:mt-5">
                                    <Image
                                        src={product.images[currentImage] || '/products/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                            aria-label="Previous image"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                                        >
                                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImage((prev) => (prev + 1) % product.images.length)}
                                            aria-label="Next image"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                                        >
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>

                                        <div className="flex justify-center gap-2 mt-4">
                                            {product.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImage(idx)}
                                                    aria-label={`View image ${idx + 1}`}
                                                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200'
                                                        }`}
                                                >
                                                    <Image src={img} alt="" width={64} height={64} className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Product details */}
                            <div className="p-5 sm:p-8 flex flex-col md:overflow-y-auto md:max-h-[90vh]">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    {language === 'ar' && product.nameAr ? product.nameAr : product.name}
                                </h2>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product.rating} ({product.reviews} {t('reviews')})
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="text-3xl font-bold text-gray-900">
                                        AED {product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            AED {product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {product.description || t('descriptionPlaceholder')}
                                </p>


                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('quantity')}</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-200 rounded-full">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                aria-label="Decrease quantity"
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                aria-label="Increase quantity"
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-auto pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            if (product) {
                                                addToCart({
                                                    id: product.id,
                                                    name: product.name,
                                                    nameAr: product.nameAr,
                                                    price: product.price,
                                                    image: product.images[0],
                                                    category: product.category
                                                }, quantity);

                                                setIsAdded(true);
                                                setTimeout(() => {
                                                    setIsAdded(false);
                                                    onClose();
                                                }, 1500);
                                            }
                                        }}
                                        className={`flex-1 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isAdded
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/30'
                                            }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                {t('added')}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5 rtl:scale-x-[-1]" />
                                                {t('addToCart')}
                                            </>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isWishlisted
                                            ? 'bg-red-50 border-red-500 text-red-500'
                                            : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
