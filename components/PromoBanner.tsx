'use client';

import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import { useLanguage } from '@/src/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PromoBanner Component
 * Sticky promotional banner with countdown timer - Golden Yellow theme
 * Dismissible by user, stores preference in localStorage
 */
export default function PromoBanner() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59,
    });

    useEffect(() => {
        // Check if banner was dismissed
        const dismissed = localStorage.getItem('promoBannerDismissed');
        if (dismissed) {
            setIsVisible(false);
        }

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('promoBannerDismissed', 'true');
    };

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500"
                >
                    <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-center gap-4 relative">
                        {/* Animated icon */}
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </motion.div>

                        {/* Promo text */}
                        <p className="text-white text-sm font-medium text-center">
                            <span className="hidden sm:inline">{t('flashSale')}</span>
                            <span className="font-bold">{t('upTo50Off')}</span>
                            <span className="hidden md:inline">{t('onElectronics')}</span>
                            <span className="mx-2">•</span>
                            <span className="font-mono bg-white/20 px-2 py-0.5 rounded ltr:tracking-wider">
                                {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                            </span>
                        </p>

                        {/* Shop now button */}
                        <button className="hidden sm:block bg-white text-amber-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                            {t('shopNow')}
                        </button>

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            aria-label="Dismiss promotional banner"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
