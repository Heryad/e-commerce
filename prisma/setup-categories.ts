import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Cleaning up existing categories...');

    // Delete all existing categories (this will cascade delete products due to foreign key)
    // So we'll need to be careful - let's just update them instead

    const categories = [
        {
            slug: 'used-iphones',
            name: { en: 'Used iPhones', ar: 'آيفونات مستعملة' },
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818',
            sorting: 1,
        },
        {
            slug: 'iphones',
            name: { en: 'iPhones', ar: 'آيفونات' },
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15hero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818',
            sorting: 2,
        },
        {
            slug: 'tablets',
            name: { en: 'Tablets', ar: 'أجهزة لوحية' },
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-pro-202405?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1713308272877',
            sorting: 3,
        },
        {
            slug: 'gaming',
            name: { en: 'Gaming', ar: 'ألعاب' },
            image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
            sorting: 4,
        },
        {
            slug: 'powerbanks',
            name: { en: 'Power Banks', ar: 'بطاريات محمولة' },
            image: 'https://m.media-amazon.com/images/I/61IBBVJvSDL._AC_SL1500_.jpg',
            sorting: 5,
        },
        {
            slug: 'cables',
            name: { en: 'Cables', ar: 'كابلات' },
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQKJ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1687660671363',
            sorting: 6,
        },
        {
            slug: 'adapters',
            name: { en: 'Adapters', ar: 'محولات' },
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHJE3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1603123830000',
            sorting: 7,
        },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                name: cat.name,
                image: cat.image,
                sorting: cat.sorting,
            },
            create: {
                slug: cat.slug,
                name: cat.name,
                image: cat.image,
                sorting: cat.sorting,
            },
        });
        console.log(`✓ Created/Updated category: ${cat.name.en}`);
    }

    console.log('✅ Categories setup complete!');
}

main()
    .catch((e) => {
        console.error('Error setting up categories:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
