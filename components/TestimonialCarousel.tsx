'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    text: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Tech Enthusiast',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 5,
        text: 'Absolutely love my new headphones from Cyber! The sound quality is exceptional and the customer service was outstanding.',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Professional Photographer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        rating: 5,
        text: 'Best place to buy camera equipment. Fast shipping, authentic products, and the prices are unbeatable.',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Gadget Lover',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        rating: 5,
        text: 'I\'ve purchased multiple devices from Cyber and every experience has been seamless. Highly recommended!',
    },
    {
        id: 4,
        name: 'David Kim',
        role: 'Software Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        rating: 5,
        text: 'The MacBook I bought exceeded my expectations. Great selection and the 2-year warranty gives me peace of mind.',
    },
];

/**
 * TestimonialCarousel Component - Optimized for performance
 * Simple fade transitions instead of sliding animations
 */
export default function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const current = testimonials[currentIndex];

    return (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
            {/* Section header */}
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    What Our Customers Say
                </h2>
                <p className="text-gray-500">Trusted by thousands of happy customers</p>
            </div>

            {/* Carousel container */}
            <div className="relative">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 sm:p-12">
                    <Quote className="absolute top-6 left-6 w-12 h-12 text-amber-200" />

                    <div className="relative z-10">
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 mb-4">
                                <img
                                    src={current.avatar}
                                    alt={current.name}
                                    className="w-full h-full rounded-full bg-white"
                                />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < current.rating
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Testimonial text */}
                            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-6 leading-relaxed">
                                "{current.text}"
                            </p>

                            {/* Customer info */}
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    {current.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {current.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={goToPrev}
                    aria-label="Previous testimonial"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-50 transition-colors duration-150"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    onClick={goToNext}
                    aria-label="Next testimonial"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-50 transition-colors duration-150"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-150 ${index === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-gray-300 hover:bg-amber-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
