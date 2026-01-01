'use server';

import { prisma } from '@/src/lib/prisma';
import { PaymentMode } from '@prisma/client';

export async function createOrder(data: {
    username: string;
    phone: string;
    email?: string;
    address: string;
    totalAmount: number;
    paymentMode: 'CASH' | 'CREDIT_CARD' | 'TABBY';
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
}) {
    try {
        // Generate a simple order key
        const orderKey = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const order = await prisma.order.create({
            data: {
                orderKey,
                username: data.username,
                phone: data.phone,
                email: data.email,
                address: data.address,
                totalAmount: data.totalAmount,
                paymentMode: data.paymentMode as PaymentMode,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // Convert Decimal fields to numbers for serialization to Client Components
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
        console.error('Failed to create order:', error);
        return { success: false, error: 'Failed to create order in database' };
    }
}
