import Navbar from '@/components/Navbar';
import HomeClient from '@/components/HomeClient';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Fetch products from database (limit to 50 for home page)
  const allProducts = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
      company: true,
    },
  });

  // Fetch categories from database
  const categoriesFromDb = await prisma.category.findMany({
    orderBy: {
      sorting: 'asc',
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  // Separate Used iPhones from other products
  const usedSmartphones = allProducts.filter(
    (product) => product.category.slug === 'used-smartphones'
  );

  const regularProducts = allProducts.filter(
    (product) => product.category.slug !== 'used-smartphones'
  );

  // Transform products to match the expected format
  const transformProducts = (products: typeof allProducts) =>
    products.map((product) => ({
      objectID: product.id,
      post_title:
        typeof product.name === 'object' && product.name !== null
          ? (product.name as any).en || ''
          : String(product.name),
      post_title_ar:
        typeof product.name === 'object' && product.name !== null
          ? (product.name as any).ar || undefined
          : undefined,
      price: Number(product.price),
      regular_price: String(product.price),
      sale_price: String(product.price),
      images: product.images[0] || '',
      allImages: product.images,
      rating_reviews: {
        rating: product.rating,
        reviews: 0,
      },
      discount:
        product.discountType === 'PERCENTAGE'
          ? Number(product.discountValue)
          : 0,
      discount_val:
        product.discountType === 'FIXED' ? Number(product.discountValue) : 0,
      in_stock: product.isAvailable ? 1 : 0,
      tags: [],
      category: {
        name:
          typeof product.category.name === 'object' &&
            product.category.name !== null
            ? (product.category.name as any).en || ''
            : String(product.category.name),
        slug: product.category.slug,
      },
    }));

  const transformedProducts = transformProducts(regularProducts);
  const transformedUsedSmartphones = transformProducts(usedSmartphones);

  // Transform categories
  const transformedCategories = categoriesFromDb.map((category) => ({
    id: category.id,
    name:
      typeof category.name === 'object' && category.name !== null
        ? (category.name as any).en || ''
        : String(category.name),
    nameAr:
      typeof category.name === 'object' && category.name !== null
        ? (category.name as any).ar || ''
        : String(category.name),
    slug: category.slug,
    image: category.image || '/placeholder-category.png',
    productCount: category._count.products,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HomeClient
        products={transformedProducts}
        usedSmartphones={transformedUsedSmartphones}
        categories={transformedCategories}
      />
    </div>
  );
}
