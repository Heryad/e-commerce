'use client';

import Image from 'next/image';
import { Heart, Eye, ShoppingCart, Star, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { useCart } from '@/src/context/CartContext';


interface ProductCardProps {
    id: string;
    name: string;
    nameAr?: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
    rating?: number;
    category?: string;
    isNew?: boolean;
    colors?: string[];
    onQuickView?: () => void;
}

/**
 * ProductCard Component - Optimized for performance
 * Uses CSS transitions instead of Framer Motion for better FPS
 */
export default function ProductCard({
    id,
    name,
    nameAr,
    price,
    originalPrice,
    image,
    badge,
    rating = 0,
    category,
    isNew = false,
    colors,
    onQuickView,
}: ProductCardProps) {
    const { language, t } = useLanguage();
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuickView?.();
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart({
            id,
            name,
            nameAr,
            price,
            image,
            category
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div
            onClick={onQuickView}
            className="group bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-100/50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image container */}
            <div className="relative aspect-square bg-white overflow-hidden">
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
                    {badge && (
                        <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            {badge}
                        </span>
                    )}
                    {isNew && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {t('newLaunches')}
                        </span>
                    )}
                </div>

                {/* Discount badge */}
                {discount > 0 && (
                    <div className="absolute top-2 right-2 z-10">
                        <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">
                            -{discount}%
                        </span>
                    </div>
                )}

                {/* Product image */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="relative w-full h-full transition-transform duration-200 group-hover:scale-105">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Hover action buttons */}
                <div
                    className={`absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-2 transition-all duration-200 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                >
                    {/* Wishlist */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsWishlisted(!isWishlisted);
                        }}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors duration-150 ${isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick view */}
                    <button
                        onClick={handleQuickView}
                        aria-label="Quick view product"
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-zinc-950 hover:text-white transition-colors duration-150"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Add to cart */}
                    <button
                        onClick={handleAddToCart}
                        aria-label={isAdded ? "Added to cart" : "Add to cart"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isAdded ? 'bg-green-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                    >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Product info - Gray background */}
            <div className="p-3 bg-gray-50 text-center">
                {/* Product name */}
                <h3 className="text-xs font-semibold text-gray-900 mt-1 mb-1.5 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors duration-150">
                    {language === 'ar' && nameAr ? nameAr : name}
                </h3>

                {/* Price */}
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-zinc-950">
                        {language === 'ar' ? `درهم ${price.toLocaleString()}` : `AED ${price.toLocaleString()}`}
                    </span>
                    {originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                            {language === 'ar' ? `درهم ${originalPrice.toLocaleString()}` : `AED ${originalPrice.toLocaleString()}`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
