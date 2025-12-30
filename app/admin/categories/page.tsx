
import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteCategory } from './actions';

export default async function CategoriesPage() {
    let categories: any[] = [];
    try {
        categories = await prisma.category.findMany({
            orderBy: { sorting: 'asc' },
            include: { _count: { select: { products: true } } }
        });
    } catch (e) {
        console.log("DB not ready");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link
                    href="/admin/categories/new"
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Name (EN/AR)</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Sorting</th>
                            <th className="px-6 py-4">Products</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat: any) => {
                            const name = cat.name as { en: string, ar: string };
                            return (
                                <tr key={cat.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {cat.image && (
                                                <img src={cat.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{name?.en || 'No Name'}</div>
                                                <div className="text-xs text-gray-500">{name?.ar}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{cat.slug}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{cat.sorting}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                                            {cat._count.products} Products
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/categories/${cat.id}`}
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteCategory.bind(null, cat.id)}>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No categories found. Add your first category.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
