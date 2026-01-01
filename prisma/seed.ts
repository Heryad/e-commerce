import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const storageDir = path.join(process.cwd(), 'public', 'storage');
    const files = fs.readdirSync(storageDir).filter(f => f.endsWith('.json'));

    console.log('Found files:', files);

    for (const file of files) {
        console.log(`Processing file: ${file}...`);
        const filePath = path.join(storageDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Handling nested structure if results[0].hits exists
        const hits = data.results && data.results[0] && data.results[0].hits ? data.results[0].hits : [];

        if (hits.length === 0) {
            console.log(`No hits found in ${file}`);
            continue;
        }

        for (const hit of hits) {
            try {
                const categoryName = hit.taxonomies?.taxonomies_hierarchical?.product_cat?.lvl1 || 'Uncategorized';
                const brandName = hit.taxonomies?.product_brand?.[0] || 'Unknown';

                const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 190);
                const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 190);

                // Ensure Category exists
                const category = await prisma.category.upsert({
                    where: { slug: categorySlug },
                    update: {},
                    create: {
                        name: { en: categoryName, ar: categoryName },
                        slug: categorySlug
                    }
                });

                // Ensure Company/Brand exists
                const brand = await prisma.company.upsert({
                    where: { slug: brandSlug },
                    update: {},
                    create: {
                        name: { en: brandName, ar: brandName },
                        slug: brandSlug
                    }
                });

                // Create Product
                await prisma.product.upsert({
                    where: { id: String(hit.objectID) },
                    update: {
                        price: hit.price,
                        isAvailable: hit.in_stock === 1,
                    },
                    create: {
                        id: String(hit.objectID),
                        name: { en: hit.post_title, ar: hit.post_title_ar || hit.post_title },
                        price: hit.price,
                        images: Array.isArray(hit.images) ? hit.images : [hit.images].filter(Boolean),
                        categoryId: category.id,
                        companyId: brand.id,
                        rating: hit.rating_reviews?.rating || 0,
                        isAvailable: hit.in_stock === 1,
                        maxQuantity: 100
                    }
                });
            } catch (itemError) {
                console.error(`Error processing item ${hit.objectID} in ${file}:`, itemError);
            }
        }
        console.log(`Finished ${file}`);
    }
}

main()
    .catch(e => {
        console.error('Fatal seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
