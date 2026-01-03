'use client';

import ProductCard from '@/components/ProductCard';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import QuickViewModal from '@/components/QuickViewModal';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones, CreditCard, RefreshCw } from 'lucide-react';

// Product type for QuickView Modal
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
}

interface SmartphoneProduct {
    objectID: string;
    post_title: string;
    post_title_ar?: string;
    price: number;
    regular_price: string;
    sale_price?: string;
    images: string;
    allImages?: string[];
    rating_reviews?: {
        rating: number;
        reviews: number;
    };
    discount?: number;
    discount_val?: number;
    in_stock: number;
    tags?: Array<{ title?: string; code?: string }>;
    category?: {
        name: string;
        slug: string;
    };
}

interface Category {
    id: string;
    name: string;
    nameAr: string;
    slug: string;
    image: string;
    productCount: number;
}

interface HomeClientProps {
    products: SmartphoneProduct[];
    usedSmartphones: SmartphoneProduct[];
    categories: Category[];
}

export default function HomeClient({ products, usedSmartphones, categories }: HomeClientProps) {
    const { language, t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const heroSlides = [
        {
            id: 1,
            title: t('hero1Title'),
            subtitle: t('hero1Subtitle'),
            buttonText: t('shopNow'),
            img: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png'
        },
        {
            id: 2,
            title: t('hero2Title'),
            subtitle: t('hero2Subtitle'),
            buttonText: t('explore'),
            img: 'https://rewardmobile.co.uk/wp-content/uploads/2025/09/iPhone17-Air_sky-blue_front-back.png'
        },
        {
            id: 3,
            title: t('hero3Title'),
            subtitle: t('hero3Subtitle'),
            buttonText: t('learnMore'),
            img: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121032-iphone-16-pro-max.png'
        },
    ];

    const openQuickView = (product: SmartphoneProduct) => {
        setQuickViewProduct({
            id: product.objectID,
            name: product.post_title,
            nameAr: product.post_title_ar,
            price: product.price,
            originalPrice: parseFloat(product.regular_price),
            images: [product.images],
            rating: product.rating_reviews?.rating || 0,
            reviews: product.rating_reviews?.reviews || 0,
            description: language === 'ar' && product.post_title_ar ? product.post_title_ar : product.post_title,
        });
        setIsQuickViewOpen(true);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    // Get featured products (first 4 with highest discount)
    const featuredProducts = [...products]
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 4);

    // Get IDs of featured products to avoid duplicates
    const featuredIds = new Set(featuredProducts.map(p => p.objectID));

    // Get new launches (most recent products, excluding featured)
    const newProducts = products
        .filter(p => !featuredIds.has(p.objectID))
        .slice(0, 4);

    // Get IDs of featured and new products
    const usedIds = new Set([...featuredIds, ...newProducts.map(p => p.objectID)]);

    // Best sellers (highest rated, excluding already shown products)
    const bestSellers = [...products]
        .filter(p => !usedIds.has(p.objectID))
        .sort((a, b) => (b.rating_reviews?.rating || 0) - (a.rating_reviews?.rating || 0))
        .slice(0, 8);

    // Update used IDs for recently viewed
    bestSellers.forEach(p => usedIds.add(p.objectID));

    // Recently viewed (different products from all above)
    const recentlyViewed = products
        .filter(p => !usedIds.has(p.objectID))
        .slice(0, 4);


    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[600px] sm:h-[700px] lg:h-[750px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center pt-32 sm:pt-28">
                    <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
                        {/* Sliding Text */}
                        <div className="text-white max-w-xl relative h-[280px]">
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-all duration-500 ease-out ${index === currentSlide
                                        ? 'opacity-100 translate-x-0'
                                        : index < currentSlide
                                            ? 'opacity-0 -translate-x-8'
                                            : 'opacity-0 translate-x-8'
                                        }`}
                                >
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-medium">{t('newLaunches')}</span>
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-base sm:text-lg mb-8 text-white/70 leading-relaxed">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            href="/products?category=smartphones"
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-amber-500/25 transition-shadow duration-200 inline-flex items-center gap-2"
                                        >
                                            {slide.buttonText}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hero Product Image */}
                        <div className="hidden lg:flex justify-center items-center relative h-[400px]">
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center ${index === currentSlide
                                        ? 'opacity-100 scale-100 translate-y-0'
                                        : 'opacity-0 scale-90 translate-y-8'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full blur-3xl scale-150 animate-pulse" />
                                        <img
                                            src={slide.img}
                                            alt={slide.title}
                                            className="relative w-[450px] h-[450px] object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <button onClick={prevSlide} aria-label="Previous" className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors z-10">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextSlide} aria-label="Next" className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors z-10">
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-200 ${index === currentSlide ? 'w-8 bg-amber-500' : 'w-2 bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Categories - Horizontal Scrollable Bar */}
            <section className="bg-gray-50 py-8">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('categories')}</h2>
                        <Link href="/products" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                            {t('viewAll')}
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </Link>
                    </div>

                    {/* Horizontal Scrollable Categories */}
                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className="group flex-shrink-0 w-[140px] sm:w-[160px] snap-start"
                                >
                                    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-amber-500 hover:shadow-lg transition-all duration-200 h-full">
                                        <div className="aspect-square bg-white rounded-xl overflow-hidden mb-3 group-hover:from-amber-50 group-hover:to-orange-50 transition-all duration-200">
                                            <img
                                                src={category.image}
                                                alt={language === 'ar' ? category.nameAr : category.name}
                                                className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-200"
                                            />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors text-center line-clamp-1">
                                            {language === 'ar' ? category.nameAr : category.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 text-center">
                                            {category.productCount} {language === 'ar' ? 'منتجات' : 'items'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Offers */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('bestDiscount')}</h2>
                            <p className="text-sm text-gray-500">{t('topRated')}</p>
                        </div>
                    </div>
                    <Link href="/products?category=smartphones" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                        {t('viewAll')}
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.objectID}
                            id={product.objectID}
                            name={product.post_title}
                            nameAr={product.post_title_ar}
                            price={product.price}
                            originalPrice={parseFloat(product.regular_price)}
                            image={product.images}
                            badge={product.discount ? `${product.discount}% OFF` : undefined}
                            rating={product.rating_reviews?.rating || 0}
                            onQuickView={() => openQuickView(product)}
                        />
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 sm:p-10 shadow-xl">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
                        {[
                            { icon: <Truck className="w-6 h-6 text-white" />, title: t('freeShipping'), desc: t('freeShippingDesc') },
                            { icon: <RotateCcw className="w-6 h-6 text-white" />, title: t('easyReturns'), desc: t('easyReturnsDesc') },
                            { icon: <ShieldCheck className="w-6 h-6 text-white" />, title: t('warrantyTitle'), desc: t('warrantyDesc') },
                            { icon: <Headphones className="w-6 h-6 text-white" />, title: t('support247'), desc: t('support247Desc') },
                            { icon: <CreditCard className="w-6 h-6 text-white" />, title: t('securePayment'), desc: t('securePaymentDesc') },
                        ].map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="mb-3 p-3 bg-white/20 rounded-2xl">{feature.icon}</div>
                                <h3 className="text-sm sm:text-base font-semibold text-white mb-1">{feature.title}</h3>
                                <p className="text-xs sm:text-sm text-amber-100">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Used iPhones Section */}
            {usedSmartphones.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 sm:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <RefreshCw className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {language === 'ar' ? 'هواتف ذكية مستعملة' : 'Used Smartphones'}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {language === 'ar' ? 'أجهزة مجددة بأسعار رائعة' : 'Refurbished devices at great prices'}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/products?category=used-smartphones"
                                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                            >
                                {t('viewAll')}
                                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {usedSmartphones.slice(0, 8).map((product) => (
                                <ProductCard
                                    key={product.objectID}
                                    id={product.objectID}
                                    name={product.post_title}
                                    nameAr={product.post_title_ar}
                                    price={product.price}
                                    originalPrice={parseFloat(product.regular_price)}
                                    image={product.images}
                                    rating={product.rating_reviews?.rating || 0}
                                    badge="Renewed"
                                    onQuickView={() => openQuickView(product)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* New Launches */}
            {newProducts.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('newLaunches')}</h2>
                                <p className="text-sm text-gray-500">{t('hero1Subtitle')}</p>
                            </div>
                        </div>
                        <Link href="/products?category=smartphones" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                            {t('viewAll')}
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {newProducts.map((product) => (
                            <ProductCard
                                key={product.objectID}
                                id={product.objectID}
                                name={product.post_title}
                                nameAr={product.post_title_ar}
                                price={product.price}
                                originalPrice={parseFloat(product.regular_price)}
                                image={product.images}
                                rating={product.rating_reviews?.rating || 0}
                                isNew={true}
                                onQuickView={() => openQuickView(product)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Best Sellers */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('bestSellers')}</h2>
                            <p className="text-sm text-gray-500">{t('topRated')}</p>
                        </div>
                    </div>
                    <Link href="/products?category=smartphones" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                        {t('viewAll')}
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {bestSellers.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product.objectID}
                            id={product.objectID}
                            name={product.post_title}
                            nameAr={product.post_title_ar}
                            price={product.price}
                            originalPrice={parseFloat(product.regular_price)}
                            image={product.images}
                            rating={product.rating_reviews?.rating || 0}
                            onQuickView={() => openQuickView(product)}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
                    {bestSellers.slice(4, 8).map((product) => (
                        <ProductCard
                            key={product.objectID}
                            id={product.objectID}
                            name={product.post_title}
                            nameAr={product.post_title_ar}
                            price={product.price}
                            originalPrice={parseFloat(product.regular_price)}
                            image={product.images}
                            rating={product.rating_reviews?.rating || 0}
                            onQuickView={() => openQuickView(product)}
                        />
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <TestimonialCarousel />

            {/* Recently Viewed */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('recentlyViewed')}</h2>
                            <p className="text-sm text-gray-500">{t('continueWhereLeftOff')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {recentlyViewed.map((product) => (
                        <ProductCard
                            key={product.objectID}
                            id={product.objectID}
                            name={product.post_title}
                            nameAr={product.post_title_ar}
                            price={product.price}
                            originalPrice={parseFloat(product.regular_price)}
                            image={product.images}
                            rating={product.rating_reviews?.rating || 0}
                            onQuickView={() => openQuickView(product)}
                        />
                    ))}
                </div>
            </section>

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
}
