
import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { deleteProduct } from './actions';

export default async function ProductsPage() {
    let products: any[] = [];
    try {
        products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: { category: true, company: true }
        });
    } catch (e) { console.log('DB error', e); }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product: any) => {
                            const name = product.name as { en: string };
                            const categoryName = product.category?.name as { en: string };
                            const image = product.images?.[0];

                            return (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {image ? (
                                                    <img src={image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 line-clamp-1">{name?.en || 'Untitled'}</div>
                                                <div className="text-xs text-gray-500">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                            {categoryName?.en || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        AED {Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-sm text-gray-600">{product.maxQuantity} in stock</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No products found. Add your first product.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
