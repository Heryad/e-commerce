
import { prisma } from '@/src/lib/prisma';
import { updateCategory } from '../actions';
import CategoryForm from '../_components/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const category = await prisma.category.findUnique({
        where: { id: params.id }
    });

    if (!category) {
        notFound();
    }

    const updateAction = updateCategory.bind(null, category.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">Edit Category</h1>
            </div>

            <CategoryForm action={updateAction} initialData={category} />
        </div>
    );
}
