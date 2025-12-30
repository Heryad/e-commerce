
import { createCategory } from '../actions';
import CategoryForm from '../_components/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCategoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">New Category</h1>
            </div>

            <CategoryForm action={createCategory} />
        </div>
    );
}
