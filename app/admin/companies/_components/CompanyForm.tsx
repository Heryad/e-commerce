
'use client';

export default function CompanyForm({ action, initialData }: { action: any, initialData?: any }) {
    const name = initialData?.name as { en: string, ar: string } | undefined;

    return (
        <form action={action} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                        <input
                            name="nameEn"
                            defaultValue={name?.en}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                            placeholder="Apple"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name (Arabic)</label>
                        <input
                            name="nameAr"
                            defaultValue={name?.ar}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition text-right"
                            placeholder="أبل"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input
                        name="slug"
                        defaultValue={initialData?.slug}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-mono text-sm"
                        placeholder="apple"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                        name="image"
                        defaultValue={initialData?.image}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sorting Order</label>
                    <input
                        type="number"
                        name="sorting"
                        defaultValue={initialData?.sorting || 0}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition shadow-lg shadow-amber-500/25"
                    >
                        {initialData ? 'Update Company' : 'Create Company'}
                    </button>
                </div>
            </div>
        </form>
    );
}
