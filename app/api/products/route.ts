import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '12');
        const categorySlug = searchParams.get('category');
        const sortBy = searchParams.get('sortBy') || 'createdAt';

        // Build where clause
        const where: any = {
            isAvailable: true,
        };

        if (categorySlug) {
            where.category = {
                slug: categorySlug,
            };
        }

        // Fetch products
        const products = await prisma.product.findMany({
            where,
            take: limit,
            orderBy:
                sortBy === 'rating'
                    ? { rating: 'desc' }
                    : sortBy === 'price-asc'
                        ? { price: 'asc' }
                        : sortBy === 'price-desc'
                            ? { price: 'desc' }
                            : { createdAt: 'desc' },
            include: {
                category: true,
                company: true,
            },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
