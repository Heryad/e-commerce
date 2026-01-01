'use client';

import { LanguageProvider } from '@/src/context/LanguageContext';
import { CartProvider } from '@/src/context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </LanguageProvider>
    );
}
