'use client';

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send, Shield, Truck, CreditCard, Headphones } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/src/context/LanguageContext';


/**
 * Footer Component - Golden Yellow theme
 * Premium footer with newsletter, social links, payment icons, and trust badges
 */
export default function Footer() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Newsletter section */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="text-center lg:text-left">
                            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                                {t('subscribeNewsletter')}
                            </h3>
                            <p className="text-amber-100 text-sm sm:text-base">
                                {t('exclusiveOffers')}
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 min-w-[280px]">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('enterEmail')}
                                        aria-label={t('enterEmail')}
                                        className="w-full bg-white/90 border border-white rounded-full pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className={`px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${isSubscribed
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <span>{t('subscribed')}</span>
                                            <span>✓</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{t('subscribe')}</span>
                                            <Send className="w-4 h-4 rtl:rotate-180" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="border-b border-gray-800">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{t('freeShipping')}</h4>
                                <p className="text-gray-400 text-xs">{t('freeShippingDesc')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{t('securePayment')}</h4>
                                <p className="text-gray-400 text-xs">{t('securePaymentDesc')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{t('easyReturns')}</h4>
                                <p className="text-gray-400 text-xs">{t('easyReturnsDesc')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                                <Headphones className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{t('support247')}</h4>
                                <p className="text-gray-400 text-xs">{t('support247Desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer content */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {/* Brand info */}
                    <div>
                        <div className="mb-4">
                            <img
                                src="/logo.png"
                                alt="Cyber Logo"
                                className="h-52 w-auto object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            {t('brandDesc')}
                        </p>
                        <div className="flex gap-3">
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, y: -2 }}
                                aria-label="Follow us on Facebook"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, y: -2 }}
                                aria-label="Follow us on Twitter"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, y: -2 }}
                                aria-label="Follow us on Instagram"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1, y: -2 }}
                                aria-label="Subscribe to our YouTube"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {['About Us', 'Shop', 'Categories', 'Deals', 'Blog'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 transition-all" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-3">
                            {['Contact Us', 'Shipping Policy', 'Returns & Exchanges', 'FAQs', 'Track Order'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 transition-all" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Info</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-400" />
                                <span className="text-sm text-gray-400">Al Wahda Street, Al Majaz 2, Sharjah, UAE</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 flex-shrink-0 text-amber-400" />
                                <a href="tel:+971558580297" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                                    +971 55 858 0297
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 flex-shrink-0 text-amber-400" />
                                <a href="mailto:support@elmougi.ae" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                                    support@elmougi.ae
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payment methods & Copyright */}
            <div className="border-t border-gray-800">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            {t('rightsReserved')}
                        </p>

                        {/* Payment methods */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 mr-2">{t('accept')}</span>
                            <div className="flex items-center gap-2">
                                {/* Visa */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-blue-600">VISA</span>
                                </div>
                                {/* Mastercard */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                    <div className="flex">
                                        <div className="w-3 h-3 bg-red-500 rounded-full -mr-1" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                    </div>
                                </div>
                                {/* Apple Pay */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-gray-800">Pay</span>
                                </div>
                                {/* PayPal */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-blue-800">PP</span>
                                </div>
                            </div>
                        </div>

                        {/* Policy links */}
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                                {t('privacyPolicy')}
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-amber-400 transition-colors">
                                {t('termsOfService')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
