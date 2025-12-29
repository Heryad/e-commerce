import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elseyed Elmougi - Premium Electronics Store",
  description: "Shop the latest electronics, smartphones, laptops, and accessories from top brands",
  keywords: ["electronics", "smartphones", "laptops", "headphones", "cameras", "gadgets", "tech store"],
  openGraph: {
    title: "Elseyed Elmougi - Premium Electronics Store",
    description: "Shop the latest electronics from top brands",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white overflow-x-hidden`}
      >
        <Providers>
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <PromoBanner />
            <main id="main-content" className="flex-grow w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
