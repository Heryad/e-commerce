import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // Mapping of old category slugs to new category slugs
        const categoryMapping: Record<string, string> = {
            'mobiles-amp-tablets-mobile-accessories': 'adapters', // or 'cables' depending on the products
            'gaming-gaming-accessories': 'gaming',
            'mobiles-amp-tablets-mobiles': 'iphones',
            'mobiles-amp-tablets-tablets': 'tablets',
        };

        let reassignedCount = 0;
        let deletedCount = 0;

        for (const [oldSlug, newSlug] of Object.entries(categoryMapping)) {
            // Find the old and new categories
            const oldCategory = await prisma.category.findUnique({
                where: { slug: oldSlug },
                include: { products: true },
            });

            const newCategory = await prisma.category.findUnique({
                where: { slug: newSlug },
            });

            if (oldCategory && newCategory) {
                // Reassign all products from old category to new category
                const updateResult = await prisma.product.updateMany({
                    where: { categoryId: oldCategory.id },
                    data: { categoryId: newCategory.id },
                });

                reassignedCount += updateResult.count;

                // Delete the old category
                await prisma.category.delete({
                    where: { id: oldCategory.id },
                });

                deletedCount++;
                console.log(`✓ Reassigned ${updateResult.count} products from ${oldSlug} to ${newSlug}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Categories cleaned up successfully',
            reassignedProducts: reassignedCount,
            deletedCategories: deletedCount,
        });
    } catch (error) {
        console.error('Error cleaning up categories:', error);
        return NextResponse.json(
            { error: 'Failed to cleanup categories', details: String(error) },
            { status: 500 }
        );
    }
}
