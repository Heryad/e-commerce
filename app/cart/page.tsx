'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext';

interface CartItem {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
    quantity: number;
    category: string;
}

export default function CartPage() {
    const { language, t } = useLanguage();

    // Mock cart data
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 'iphone-15-pro',
            name: 'iPhone 15 Pro',
            nameAr: 'آيفون 15 برو',
            price: 4299,
            image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/iphone_15_pro_natural_titanium_1?1694600215',
            quantity: 1,
            category: 'Phones'
        },
        {
            id: 'airpods-pro-2',
            name: 'AirPods Pro (2nd Gen)',
            nameAr: 'أيربودز برو (الجيل الثاني)',
            price: 949,
            image: 'https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/S000394523_1?1760533220',
            quantity: 2,
            category: 'Audio'
        }
    ]);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 20;
    const vat = Math.round(subtotal * 0.05); // 5% VAT
    const total = subtotal + shipping;

    const formatCurrency = (amount: number) => {
        return language === 'ar' ? `درهم ${amount.toLocaleString()}` : `AED ${amount.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-zinc-950 pt-32 pb-12">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {t('shoppingCart')}
                    </h1>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-amber-400">{t('cart')}</span>
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-12">
                {cartItems.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex gap-4 sm:gap-6 items-center"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate">
                                                        {language === 'ar' ? item.nameAr : item.name}
                                                    </h3>
                                                    <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                                                        {item.category}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    title={t('remove')}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:text-amber-600 transition-all shadow-sm"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:text-amber-600 transition-all shadow-sm"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-zinc-950">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-gray-500">
                                                            {formatCurrency(item.price)} / unit
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-32">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('subtotal')}</span>
                                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('shipping')}</span>
                                        <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                                            {shipping === 0 ? t('free') : formatCurrency(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('estimatedVat')} (5%)</span>
                                        <span className="font-medium">{formatCurrency(vat)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">{t('total')}</p>
                                            <p className="text-3xl font-bold text-zinc-950">
                                                {formatCurrency(total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    {t('checkout')}
                                    {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                </Link>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span>Secure Checkout with AES-256 Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        <span>Orders over AED 200 qualify for FREE shipping</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 sm:p-20 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            {t('emptyCart')}
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-10">
                            Looks like you haven't added anything to your cart yet. Explore our latest electronics and find something you love!
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                        >
                            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                            {t('continueShopping')}
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
