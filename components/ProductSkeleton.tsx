'use client';

/**
 * ProductSkeleton Component
 * Loading placeholder for ProductCard with shimmer animation
 */
export default function ProductSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            {/* Image skeleton */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 sm:p-5 space-y-3">
                {/* Category skeleton */}
                <div className="h-3 w-16 bg-gray-200 rounded animate-shimmer" />

                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-shimmer" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-shimmer" />
                </div>

                {/* Rating skeleton */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded animate-shimmer" />
                    ))}
                    <div className="h-3 w-8 ml-1 bg-gray-200 rounded animate-shimmer" />
                </div>

                {/* Price skeleton */}
                <div className="flex items-baseline gap-2">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-shimmer" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-shimmer" />
                </div>
            </div>
        </div>
    );
}
