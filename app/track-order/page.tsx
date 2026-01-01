'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { getOrderStatus } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function TrackOrderPage() {
    const { language, t } = useLanguage();
    const [orderKey, setOrderKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderKey.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        const result = await getOrderStatus(orderKey);
        if (result.success) {
            setOrder(result.order);
        } else {
            setError(t('orderNotFound' as any));
        }
        setLoading(false);
    };

    const getStatusStep = (status: string) => {
        const stages = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
        return stages.indexOf(status);
    };

    const steps = [
        { key: 'PENDING', label: language === 'ar' ? 'قيد الانتظار' : 'Pending', icon: Clock },
        { key: 'CONFIRMED', label: language === 'ar' ? 'تم التأكيد' : 'Confirmed', icon: CheckCircle2 },
        { key: 'SHIPPED', label: language === 'ar' ? 'جاري الشحن' : 'Shipped', icon: Truck },
        { key: 'DELIVERED', label: language === 'ar' ? 'تم التوصيل' : 'Delivered', icon: Package },
    ];

    const currentStep = order ? getStatusStep(order.status) : -1;

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">
                        {t('trackOrder' as any)}
                    </h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {t('trackInstructions' as any)}
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 mb-8">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('enterOrderNumber' as any)}
                                value={orderKey}
                                onChange={(e) => setOrderKey(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono uppercase"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-zinc-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                t('trackNow' as any)
                            )}
                        </button>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}
                </div>

                <AnimatePresence>
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Order Info Header */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                                    <div>
                                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            {t('orderNumber' as any)}
                                        </h2>
                                        <p className="text-2xl font-mono font-black text-zinc-900">{order.orderKey}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            {t('currentStatus' as any)}
                                        </h2>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider
                                            ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}
                                        `}>
                                            {steps.find(s => s.key === order.status)?.label || order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {order.status !== 'CANCELLED' && (
                                    <div className="relative pt-8 pb-4">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-full" />
                                        <div
                                            className="absolute top-0 left-0 h-1 bg-amber-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
                                        />

                                        <div className="flex justify-between items-start relative mt-6">
                                            {steps.map((step, idx) => {
                                                const Icon = step.icon;
                                                const isActive = idx <= currentStep;
                                                const isCurrent = idx === currentStep;

                                                return (
                                                    <div key={step.key} className="flex flex-col items-center text-center max-w-[80px]">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-3
                                                            ${isActive ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}
                                                            ${isCurrent ? 'ring-4 ring-amber-100 scale-110' : ''}
                                                        `}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <span className={`text-[10px] font-bold uppercase leading-tight tracking-wider
                                                            ${isActive ? 'text-zinc-900' : 'text-gray-400'}
                                                        `}>
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Details Mini-Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                                <h3 className="font-bold text-zinc-900 mb-4">{language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{language === 'ar' ? 'العميل' : 'Customer'}</span>
                                        <span className="font-bold text-zinc-900">{order.username}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{language === 'ar' ? 'التاريخ' : 'Date'}</span>
                                        <span className="font-bold text-zinc-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-3 border-t border-zinc-50">
                                        <span className="text-gray-500 font-bold">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                        <span className="font-black text-amber-600">AED {order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'ar' ? 'العودة للتسوق' : 'Back to Shopping'}
                    </Link>
                </div>
            </main>
        </div>
    );
}
