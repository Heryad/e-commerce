'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CreditCard, Truck, ShieldCheck, CheckCircle2, MapPin, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext';
import { useCart } from '@/src/context/CartContext';
import { createOrder } from './actions';

export default function CheckoutPage() {
    const { language, t } = useLanguage();
    const { cartItems, cartSubtotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<any>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyId = () => {
        if (!createdOrder?.orderKey) return;
        navigator.clipboard.writeText(createdOrder.orderKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const shipping = cartSubtotal > 200 || cartItems.length === 0 ? 0 : 20;
    const vat = Math.round(cartSubtotal * 0.05);
    const total = cartSubtotal + shipping;

    const formatCurrency = (amount: number) => {
        return language === 'ar' ? `درهم ${amount.toLocaleString()}` : `AED ${amount.toLocaleString()}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('fullName') as string;
        const email = formData.get('emailAddress') as string;
        const phone = formData.get('phoneNumber') as string;
        const street = formData.get('streetAddress') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;

        const address = `${street}, ${city}, ${state}`;

        const result = await createOrder({
            username: name,
            phone,
            email,
            address,
            totalAmount: total,
            paymentMode: paymentMethod === 'card' ? 'CREDIT_CARD' : 'CASH',
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        });

        if (result.success) {
            setCreatedOrder(result.order);
            setIsSubmitted(true);
            clearCart();
        } else {
            alert(t('errorOccurred' as any) || 'Failed to place order. Products might not exist in the database.');
        }
        setIsSubmitting(false);
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
                    <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">
                        {language === 'ar' ? 'شكراً لطلبك!' : 'Thank You for Your Order!'}
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        {language === 'ar'
                            ? 'تم استلام طلبك بنجاح. سنقوم بإرسال رسالة تأكيد إلى بريدك الإلكتروني قريباً.'
                            : 'Your order has been placed successfully. We have sent a confirmation email to your inbox.'}
                    </p>

                    {createdOrder && (
                        <div className="bg-zinc-50 rounded-2xl p-6 mb-8 w-full max-w-sm border border-zinc-100">
                            <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">
                                {(t as any)('orderNumber')}
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-xl font-mono font-black text-zinc-900">
                                    {createdOrder.orderKey}
                                </span>
                                <button
                                    onClick={handleCopyId}
                                    className="p-2 hover:bg-zinc-200 rounded-lg transition-colors relative"
                                    title={(t as any)('copyId')}
                                >
                                    {isCopied ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                    )}
                                    {isCopied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded font-bold">
                                            {(t as any)('copied')}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                        >
                            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                        </Link>
                        <Link
                            href="/track-order"
                            className="bg-white text-zinc-950 border-2 border-zinc-950 px-8 py-4 rounded-xl font-bold hover:bg-zinc-50 transition-colors"
                        >
                            {(t as any)('trackOrder')}
                        </Link>
                    </div>
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
                                        <input name="fullName" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input name="emailAddress" required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">{t('phoneNumber')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input name="phoneNumber" required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="+971 -- --- ----" />
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">{t('streetAddress')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input name="streetAddress" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Apartment, Street Name" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('city')}</label>
                                    <input name="city" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Dubai" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('state')}</label>
                                    <input name="state" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Dubai" />
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
                                            <img src={item.image} alt="" className="w-full h-full object-contain" />
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
                                    <span>{formatCurrency(cartSubtotal)}</span>
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
                                disabled={isSubmitting || cartItems.length === 0}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ShieldCheck className="w-5 h-5" />
                                )}
                                {isSubmitting ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') : t('placeOrder')}
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
