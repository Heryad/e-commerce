
import { prisma } from '@/src/lib/prisma';
import ProductForm from '../_components/ProductForm';
import { updateProduct } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [product, categories, companies] = await Promise.all([
        prisma.product.findUnique({ where: { id: params.id } }),
        prisma.category.findMany({ orderBy: { sorting: 'asc' } }),
        prisma.company.findMany({ orderBy: { sorting: 'asc' } }),
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>

            <ProductForm
                action={updateProduct.bind(null, product.id)}
                initialData={product}
                categories={categories}
                companies={companies}
            />
        </div>
    );
}
