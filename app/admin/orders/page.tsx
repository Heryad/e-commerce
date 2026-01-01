
import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import { updateOrderStatus } from './actions';
import { OrderStatus } from '@prisma/client';
import StatusSelect from './StatusSelect';

export default async function OrdersPage() {
    let orders: any[] = [];
    try {
        orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { items: { include: { product: true } } }
        });
    } catch (e) { }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Orders</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                    <Link href={`/admin/orders/${order.id}`} className="hover:text-amber-600 hover:underline">
                                        {order.orderKey || order.id.slice(0, 8)}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{order.username}</div>
                                    <div className="text-xs text-gray-500">{order.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {order.items.length} items
                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                                        {order.items.map((i: any) => (i.product?.name as any)?.en).join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    ${Number(order.totalAmount).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusSelect
                                        orderId={order.id}
                                        currentStatus={order.status}
                                        updateAction={updateOrderStatus}
                                    />
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
