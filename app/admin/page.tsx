
import { prisma } from '@/src/lib/prisma';
import { Package, ShoppingBag, Tags, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
    try {
        const [productsCount, ordersCount, categoriesCount] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.category.count(),
        ]);
        return { productsCount, ordersCount, categoriesCount };
    } catch (error) {
        console.error("Database not connected yet", error);
        return { productsCount: 0, ordersCount: 0, categoriesCount: 0 };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back to your store management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Products"
                    value={stats.productsCount}
                    icon={Package}
                    color="blue"
                    href="/admin/products"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.ordersCount}
                    icon={ShoppingBag}
                    color="amber"
                    href="/admin/orders"
                />
                <StatsCard
                    title="Categories"
                    value={stats.categoriesCount}
                    icon={Tags}
                    color="violet"
                    href="/admin/categories"
                />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link href="/admin/products/new" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                        Add New Product
                    </Link>
                    <Link href="/admin/categories/new" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Add Category
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, color, href }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <Link href={href} className="block group">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colors[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                        View All
                    </span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </Link>
    );
}
