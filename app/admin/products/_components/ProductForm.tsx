
'use client';

import { DollarSign, Layers, CheckCircle } from 'lucide-react';

export default function ProductForm({ action, initialData, categories, companies }: any) {
    const name = initialData?.name as { en: string, ar: string } | undefined;
    const desc = initialData?.description as { en: string, ar: string } | undefined;

    const featuresText = initialData?.features?.join('\n') || '';
    const imagesText = initialData?.images?.join('\n') || '';

    return (
        <form action={action} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 max-w-5xl mx-auto space-y-8">

            {/* Basic Info */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-500" />
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Name (English)</label>
                        <input name="nameEn" defaultValue={name?.en} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" placeholder="Product Name" />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Name (Arabic)</label>
                        <input name="nameAr" defaultValue={name?.ar} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-right" placeholder="اسم المنتج" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="categoryId" defaultValue={initialData?.categoryId} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none pr-8">
                            <option value="">Select Category</option>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{(c.name as any).en}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
                        <select name="companyId" defaultValue={initialData?.companyId || ''} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none pr-8">
                            <option value="">Select Company</option>
                            {companies.map((c: any) => (
                                <option key={c.id} value={c.id}>{(c.name as any).en}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Pricing & Inventory */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" step="0.01" name="price" defaultValue={initialData?.price} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Max Quantity</label>
                        <input type="number" name="maxQuantity" defaultValue={initialData?.maxQuantity || 100} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                        <select name="discountType" defaultValue={initialData?.discountType || 'NONE'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none">
                            <option value="NONE">None</option>
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                        <input type="number" step="0.01" name="discountValue" defaultValue={initialData?.discountValue || 0} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Details */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                    Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                        <textarea name="descriptionEn" defaultValue={desc?.en} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
                        <textarea name="descriptionAr" defaultValue={desc?.ar} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-right" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Features (One per line)</label>
                        <textarea name="features" defaultValue={featuresText} rows={6} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono text-sm" placeholder="- Feature 1&#10;- Feature 2" />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Images (URL per line)</label>
                        <textarea name="images" defaultValue={imagesText} rows={6} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono text-sm" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-6">
                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/30 transition transform hover:-translate-y-1">
                    {initialData ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
