'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CreditCard, Truck, ShieldCheck, CheckCircle2, MapPin, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext';

export default function CheckoutPage() {
    const { language, t } = useLanguage();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Mock cart data (should ideally come from a central state)
    const cartItems = [
        { id: 'iphone-15-pro', name: 'iPhone 15 Pro', nameAr: 'آيفون 15 برو', price: 4299, quantity: 1 },
        { id: 'airpods-pro-2', name: 'AirPods Pro (2nd Gen)', nameAr: 'أيربودز برو (الجيل الثاني)', price: 949, quantity: 2 }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 20;
    const vat = Math.round(subtotal * 0.05);
    const total = subtotal + shipping;

    const formatCurrency = (amount: number) => {
        return language === 'ar' ? `درهم ${amount.toLocaleString()}` : `AED ${amount.toLocaleString()}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center pt-48 pb-20 px-4 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8"
                    >
                        <CheckCircle2 className="w-12 h-12" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {language === 'ar' ? 'شكراً لطلبك!' : 'Thank you for your order!'}
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        {language === 'ar'
                            ? 'تم استلام طلبك بنجاح. سنقوم بإرسال رسالة تأكيد إلى بريدك الإلكتروني قريباً.'
                            : 'Your order has been placed successfully. We have sent a confirmation email to your inbox.'}
                    </p>
                    <Link
                        href="/"
                        className="bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                    >
                        {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-zinc-950 pt-32 pb-12">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('checkoutTitle')}</h1>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Link href="/cart" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                            {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                            {t('backToCart')}
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Address */}
                        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck className="w-6 h-6 text-amber-500" />
                                {t('shippingAddress')}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('fullName')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">{t('phoneNumber')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="+971 -- --- ----" />
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">{t('streetAddress')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Apartment, Street Name" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('city')}</label>
                                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Dubai" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('state')}</label>
                                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Dubai" />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-amber-500" />
                                {t('paymentMethod')}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-amber-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t('creditCard')}</p>
                                        <p className="text-xs text-gray-500">Visa, Mastercard, AMEX</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-amber-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t('cashOnDelivery')}</p>
                                        <p className="text-xs text-gray-500">Pay when you receive</p>
                                    </div>
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {paymentMethod === 'card' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">{t('cardNumber')}</label>
                                            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{t('expiryDate')}</label>
                                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="MM/YY" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{t('cvv')}</label>
                                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="123" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderReview')}</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 flex items-center justify-center p-1">
                                            <img src={`https://pimcdn.sharafdg.com/cdn-cgi/image/width=300,height=300,fit=pad/images/iphone_15_pro_natural_titanium_1?1694600215`} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{language === 'ar' ? item.nameAr : item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-gray-100 pt-6 mb-8">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>{t('subtotal')}</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>{t('shipping')}</span>
                                    <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? t('free') : formatCurrency(shipping)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>{t('estimatedVat')}</span>
                                    <span>{formatCurrency(vat)}</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-50">
                                    <span>{t('total')}</span>
                                    <span className="text-zinc-950">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                {t('placeOrder')}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-4 px-4 leading-relaxed">
                                {language === 'ar'
                                    ? 'بالنقر على "إتمام الطلب"، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.'
                                    : 'By clicking "Place Order", you agree to our Terms of Service and Privacy Policy.'}
                            </p>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
