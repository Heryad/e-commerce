
'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, formData: FormData) {
    const status = formData.get('status') as any;
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
    revalidatePath('/admin/orders');
}
