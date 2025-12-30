
import { prisma } from '@/src/lib/prisma';
import ProductForm from '../_components/ProductForm';
import { createProduct } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewProductPage() {
    const [categories, companies] = await Promise.all([
        prisma.category.findMany({ orderBy: { sorting: 'asc' } }),
        prisma.company.findMany({ orderBy: { sorting: 'asc' } }),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">Add New Product</h1>
            </div>

            <ProductForm
                action={createProduct}
                categories={categories}
                companies={companies}
            />
        </div>
    );
}
