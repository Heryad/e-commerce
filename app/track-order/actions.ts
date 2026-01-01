'use server';

import { prisma } from '@/src/lib/prisma';

export async function getOrderStatus(orderKey: string) {
    if (!orderKey) return { success: false, error: 'Order key is required' };

    try {
        const order = await prisma.order.findUnique({
            where: { orderKey: orderKey.toUpperCase().trim() },
            select: {
                id: true,
                orderKey: true,
                status: true,
                createdAt: true,
                username: true,
                totalAmount: true,
                paymentMode: true,
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Serialize decimal
        const serializedOrder = {
            ...order,
            totalAmount: Number(order.totalAmount),
            items: order.items.map(item => ({
                ...item,
                price: Number(item.price)
            }))
        };

        return { success: true, order: serializedOrder };
    } catch (error) {
        console.error('Error fetching order status:', error);
        return { success: false, error: 'An error occurred while fetching order status' };
    }
}
