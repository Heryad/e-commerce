'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/src/context/LanguageContext';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { Filter, SlidersHorizontal, Grid, List, ChevronDown, X, Star, Search } from 'lucide-react';
import { categories } from '@/src/data/categories';

interface Product {
    objectID: string;
    post_title: string;
    post_title_ar?: string;
    price: number;
    regular_price: string;
    sale_price?: string;
    images: string;
    rating_reviews?: {
        rating: number;
        reviews: number;
    };
    discount?: number;
    discount_val?: number;
    in_stock: number;
    tags?: Array<{ title?: string; code?: string }>;
    sku: string;
}

interface FilterState {
    priceRange: [number, number];
    inStock: boolean;
    rating: number;
    sortBy: string;
    search: string;
}

function ProductsPageContent() {
    const { language, t } = useLanguage();
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 20000],
        inStock: false,
        rating: 0,
        sortBy: 'featured',
        search: search || '',
    });

    // Update search filter when URL param changes
    useEffect(() => {
        const query = searchParams.get('search') || '';
        setFilters(f => ({ ...f, search: query }));
    }, [searchParams]);

    // Fetch products logic
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                if (category) {
                    const response = await fetch(`/storage/${category}.json`);
                    const data = await response.json();
                    const hits = data.results?.[0]?.hits || [];
                    setProducts(hits);
                } else {
                    // Search in ALL categories
                    const allCategories = ['gaming', 'tablets', 'iphones', 'powerbanks', 'cables', 'adapters'];
                    const promises = allCategories.map(cat =>
                        fetch(`/storage/${cat}.json`).then(res => res.json())
                    );
                    const results = await Promise.all(promises);
                    const allHits = results.flatMap(data => data.results?.[0]?.hits || []);
                    // Remove duplicates if any (based on objectID)
                    const uniqueHits = Array.from(new Map(allHits.map(item => [item.objectID, item])).values());
                    setProducts(uniqueHits);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    // Get price range from products
    const priceRange = useMemo(() => {
        if (products.length === 0) return { min: 0, max: 10000 };
        const prices = products.map(p => p.price);
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
        };
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(p =>
                p.post_title.toLowerCase().includes(searchLower)
            );
        }

        // Price range filter
        result = result.filter(p =>
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );

        // In stock filter
        if (filters.inStock) {
            result = result.filter(p => p.in_stock === 1);
        }

        // Rating filter
        if (filters.rating > 0) {
            result = result.filter(p =>
                (p.rating_reviews?.rating || 0) >= filters.rating
            );
        }

        // Sort
        switch (filters.sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating_reviews?.rating || 0) - (a.rating_reviews?.rating || 0));
                break;
            case 'discount':
                result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            default:
                // Featured - keep original order
                break;
        }

        return result;
    }, [products, filters]);

    const openQuickView = (product: Product) => {
        setQuickViewProduct({
            id: product.objectID,
            name: product.post_title,
            price: product.price,
            originalPrice: parseFloat(product.regular_price),
            images: [product.images],
            rating: product.rating_reviews?.rating || 0,
            reviews: product.rating_reviews?.reviews || 0,
            description: product.post_title,
        });
        setIsQuickViewOpen(true);
    };

    const categoryTitle = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : filters.search
            ? 'Search Results'
            : 'All Products';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-zinc-950 pt-32 pb-12">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                {category
                                    ? (language === 'ar'
                                        ? categories.find(c => c.id === category)?.nameAr
                                        : categories.find(c => c.id === category)?.name) || category
                                    : t(filters.search ? 'searchResults' : 'allProducts')}
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                {loading ? t('loadingProducts') : `${filteredProducts.length} ${t('itemsFound')}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5" />
                                    {t('filters')}
                                </h2>
                                <button
                                    onClick={() => setFilters({
                                        priceRange: [priceRange.min, priceRange.max],
                                        inStock: false,
                                        rating: 0,
                                        sortBy: 'featured',
                                        search: '',
                                    })}
                                    className="text-sm text-amber-600 hover:text-amber-700"
                                >
                                    {t('reset')}
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('search')}</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        value={filters.search}
                                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-3 block">
                                    {t('priceRange')}: AED {filters.priceRange[0].toLocaleString()} - AED {filters.priceRange[1].toLocaleString()}
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters(f => ({ ...f, priceRange: [Number(e.target.value), f.priceRange[1]] }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        min={priceRange.min}
                                        max={filters.priceRange[1]}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        min={filters.priceRange[0]}
                                        max={priceRange.max}
                                    />
                                </div>
                            </div>

                            {/* In Stock */}
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock}
                                        onChange={(e) => setFilters(f => ({ ...f, inStock: e.target.checked }))}
                                        className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                                    />
                                    <span className="text-sm text-gray-700">In Stock Only</span>
                                </label>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-3 block">{t('minRating')}</label>
                                <div className="space-y-2">
                                    {[4, 3, 2, 1, 0].map((rating) => (
                                        <label
                                            key={rating}
                                            className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${filters.rating === rating ? 'bg-amber-50' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="rating"
                                                checked={filters.rating === rating}
                                                onChange={() => setFilters(f => ({ ...f, rating }))}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">{rating === 0 ? t('all') : `${rating}+`}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
                            {/* Mobile filter button */}
                            <button
                                onClick={() => setShowFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                {t('filters')}
                            </button>

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 hidden sm:inline">{t('sortBy')}:</span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
                                >
                                    <option value="featured">{t('featured')}</option>
                                    <option value="price-low">{t('priceLowHigh')}</option>
                                    <option value="price-high">{t('priceHighLow')}</option>
                                    <option value="rating">{t('bestRating')}</option>
                                    <option value="discount">{t('bestDiscount')}</option>
                                </select>
                            </div>

                            {/* View mode */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                                        <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                                        <div className="h-4 bg-gray-200 rounded mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl">
                                <p className="text-gray-500 text-lg">{t('noProductsFound')}</p>
                                <p className="text-gray-400 text-sm mt-2">{t('tryAdjustingFilters')}</p>
                            </div>
                        ) : (
                            <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1'
                                }`}>
                                {filteredProducts.map((product) => {
                                    const hasNewTag = product.tags?.some(t => t.title === 'New Launch');
                                    const hasSale = product.discount && product.discount > 0;

                                    return (
                                        <ProductCard
                                            key={product.objectID}
                                            id={product.objectID}
                                            name={product.post_title}
                                            nameAr={product.post_title_ar}
                                            price={product.price}
                                            originalPrice={parseFloat(product.regular_price)}
                                            image={product.images}
                                            badge={hasSale ? `${product.discount}% OFF` : undefined}
                                            rating={product.rating_reviews?.rating || 0}
                                            isNew={hasNewTag}
                                            onQuickView={() => openQuickView(product)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="fixed inset-y-0 ltr:left-0 rtl:right-0 w-[300px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button onClick={() => setShowFilters(false)}>
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400"
                                />
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters(f => ({ ...f, priceRange: [Number(e.target.value), f.priceRange[1]] }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* In Stock */}
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock}
                                        onChange={(e) => setFilters(f => ({ ...f, inStock: e.target.checked }))}
                                        className="w-5 h-5 rounded text-amber-500"
                                    />
                                    <span className="text-sm text-gray-700">In Stock Only</span>
                                </label>
                            </div>

                            {/* Apply */}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold"
                            >
                                {t('applyFilters')}
                            </button>
                        </div>
                    </div>
                </>
            )}
            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}
