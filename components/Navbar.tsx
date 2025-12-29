'use client';

import { Search, Heart, ShoppingCart, User, ChevronDown, Menu, X, Smartphone, Laptop, Watch, Camera, Headphones, Gamepad2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/src/context/LanguageContext';


// Category data for mega menu
const categories = [
  { name: 'Phones', icon: Smartphone, items: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'] },
  { name: 'Computers', icon: Laptop, items: ['MacBook', 'Windows Laptops', 'Desktop PCs', 'Monitors'] },
  { name: 'Watches', icon: Watch, items: ['Apple Watch', 'Samsung Galaxy Watch', 'Fitness Tracks', 'Smart Rings'] },
  { name: 'Cameras', icon: Camera, items: ['Mirrorless', 'DSLR', 'Action Cameras', 'Drones'] },
  { name: 'Audio', icon: Headphones, items: ['Headphones', 'Earbuds', 'Speakers', 'Home Audio'] },
  { name: 'Gaming', icon: Gamepad2, items: ['PlayStation', 'Xbox', 'Nintendo', 'Gaming PCs'] },
];

// Search suggestions
const searchSuggestions = [
  'iPhone 15 Pro Max',
  'AirPods Pro 2',
  'MacBook Pro M3',
  'Samsung Galaxy S24',
  'Sony WH-1000XM5',
];

export default function Navbar() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  const filteredSuggestions = searchQuery.length > 0
    ? searchSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSuggestions;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-2 left-0 right-0 z-50 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-[1400px] mx-auto">
          <div
            className="bg-zinc-950/95 backdrop-blur-md rounded-2xl sm:rounded-full px-4 sm:px-6 py-2 shadow-lg border border-white/10 shadow-black/20 flex items-center justify-between gap-2 sm:gap-8"
          >
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center" onClick={() => router.push('/')}>
              <img
                src="/logo.png"
                alt="Cyber Logo"
                className="h-14 sm:h-14 w-auto cursor-pointer object-contain"
              />
            </div>

            {/* Search bar */}
            <div className="hidden lg:flex flex-1 max-w-xl" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  aria-label={t('searchPlaceholder')}
                  className="w-full rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 transition-colors duration-150 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
                />

                {/* Search dropdown */}
                {searchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10">
                    <div className="p-2">
                      <p className="text-xs text-zinc-500 px-3 py-2 uppercase tracking-wider">
                        {searchQuery ? 'Results' : 'Popular Searches'}
                      </p>
                      {filteredSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full text-left px-3 py-2.5 text-zinc-300 hover:bg-white/5 hover:text-amber-500 rounded-xl transition-colors duration-100 flex items-center gap-3"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            router.push(`/products?search=${encodeURIComponent(suggestion)}`);
                            setSearchFocused(false);
                          }}
                        >
                          <Search className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Language Dropdown */}
              <div className="relative" ref={languageRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-1 transition-colors duration-150 text-zinc-400 hover:text-amber-500 px-2 py-1"
                  aria-label="Select language"
                >
                  <span className="text-xs sm:text-sm font-medium">{language === 'en' ? 'EN' : 'AR'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 rounded-xl shadow-xl border border-white/10 overflow-hidden z-[60]">
                    <div className="p-1">
                      {[
                        { name: 'English', code: 'en' },
                        { name: 'Arabic', code: 'ar' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setShowLanguageDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${language === lang.code ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'text-zinc-400 hover:bg-white/5'
                            }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                aria-label="View wishlist"
                className="relative transition-colors duration-150 text-zinc-400 hover:text-red-500"
              >
                <Heart className="w-5 h-5" />
              </button>

              <Link
                href="/cart"
                aria-label="View cart"
                className="relative transition-colors duration-150 text-zinc-400 hover:text-zinc-100"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  2
                </span>
              </Link>

              <button
                aria-label="View account"
                className="hidden sm:block transition-colors duration-150 text-zinc-400 hover:text-zinc-100"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden p-1 text-zinc-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega Menu */}
      {showMegaMenu && (
        <div
          onMouseLeave={() => setShowMegaMenu(false)}
          className="fixed top-24 left-0 right-0 z-40 px-6"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-amber-100">
              <div className="grid grid-cols-6 gap-8">
                {categories.map((category, idx) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={idx}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <a href="#" className="text-sm text-gray-600 hover:text-amber-600 transition-colors duration-100">
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 ltr:right-0 rtl:left-0 bottom-0 w-[300px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                  setMobileMenuOpen(false);
                }}
                className="relative mb-6"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </form>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 text-gray-700 hover:text-amber-600 p-3 rounded-xl hover:bg-amber-50">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{t('myAccount')}</span>
                </button>
                <button className="w-full flex items-center gap-3 text-gray-700 hover:text-red-500 p-3 rounded-xl hover:bg-red-50">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{t('wishlist')}</span>
                </button>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-amber-600 p-3 rounded-xl hover:bg-amber-50"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-medium">{t('cart')}</span>
                  </div>
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                    2
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
