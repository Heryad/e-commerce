
import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, User, Calendar, CreditCard } from 'lucide-react';
import { notFound } from 'next/navigation';
import { updateOrderStatus } from '../actions';
import StatusSelect from '../StatusSelect';

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                    <p className="text-gray-500 text-sm">#{order.orderKey || order.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Order Items</h3>
                            <span className="text-sm text-gray-500">{order.items.length} items</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item: any) => {
                                const productName = (item.product?.name as any)?.en || 'Deleted Product';
                                const productImage = item.product?.images?.[0];

                                return (
                                    <div key={item.id} className="p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                            {productImage && <img src={productImage} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{productName}</div>
                                            <div className="text-sm text-gray-500">Unit Price: ${Number(item.price).toFixed(2)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Total Amount</span>
                            <span className="text-xl font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Status */}
                <div className="space-y-6">

                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
                        <StatusSelect
                            orderId={order.id}
                            currentStatus={order.status}
                            updateAction={updateOrderStatus}
                            className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                        <p className="text-xs text-center text-gray-400 mt-2">Change status to update order</p>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Customer Info</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{order.username}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">{order.phone}</a>
                            </div>
                            {order.email && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">{order.email}</a>
                                </div>
                            )}
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <span className="text-gray-600 leading-relaxed">{order.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Date */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Payment Info</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 font-medium">{order.paymentMode}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
