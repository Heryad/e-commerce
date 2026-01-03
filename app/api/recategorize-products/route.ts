import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // Get all products from adapters category
        const adaptersCategory = await prisma.category.findUnique({
            where: { slug: 'adapters' },
            include: { products: true },
        });

        if (!adaptersCategory) {
            return NextResponse.json({ error: 'Adapters category not found' }, { status: 404 });
        }

        // Get target categories
        const cablesCategory = await prisma.category.findUnique({ where: { slug: 'cables' } });
        const powerbanksCategory = await prisma.category.findUnique({ where: { slug: 'powerbanks' } });

        if (!cablesCategory || !powerbanksCategory) {
            return NextResponse.json({ error: 'Target categories not found' }, { status: 404 });
        }

        let cablesMoved = 0;
        let powerbanksMoved = 0;

        // Categorize products based on their names
        for (const product of adaptersCategory.products) {
            const productName = typeof product.name === 'object' && product.name !== null
                ? (product.name as any).en?.toLowerCase() || ''
                : String(product.name).toLowerCase();

            // Check if it's a cable
            if (
                productName.includes('cable') ||
                productName.includes('usb') ||
                productName.includes('lightning') ||
                productName.includes('type-c') ||
                productName.includes('charger cable') ||
                productName.includes('data cable')
            ) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { categoryId: cablesCategory.id },
                });
                cablesMoved++;
                console.log(`✓ Moved to Cables: ${productName}`);
            }
            // Check if it's a powerbank
            else if (
                productName.includes('power bank') ||
                productName.includes('powerbank') ||
                productName.includes('portable charger') ||
                productName.includes('battery pack') ||
                productName.includes('external battery')
            ) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { categoryId: powerbanksCategory.id },
                });
                powerbanksMoved++;
                console.log(`✓ Moved to Power Banks: ${productName}`);
            }
            // Everything else stays in adapters
        }

        return NextResponse.json({
            success: true,
            message: 'Products recategorized successfully',
            cablesMoved,
            powerbanksMoved,
            remainingInAdapters: adaptersCategory.products.length - cablesMoved - powerbanksMoved,
        });
    } catch (error) {
        console.error('Error recategorizing products:', error);
        return NextResponse.json(
            { error: 'Failed to recategorize products', details: String(error) },
            { status: 500 }
        );
    }
}
