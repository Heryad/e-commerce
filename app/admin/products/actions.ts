
'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { DiscountType } from '@prisma/client';

export async function createProduct(formData: FormData) {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;
    const companyId = formData.get('companyId') as string || null;
    const maxQuantity = parseInt(formData.get('maxQuantity') as string) || 100;

    // Arrays - split by newline
    const features = (formData.get('features') as string).split('\n').filter(Boolean);
    const images = (formData.get('images') as string).split('\n').filter(Boolean);

    // Discount
    const discountType = formData.get('discountType') as DiscountType;
    const discountValue = parseFloat(formData.get('discountValue') as string) || 0;

    await prisma.product.create({
        data: {
            name: { en: nameEn, ar: nameAr },
            description: { en: descriptionEn, ar: descriptionAr },
            price,
            categoryId,
            companyId,
            maxQuantity,
            features,
            images,
            discountType,
            discountValue
        },
    });

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;
    const companyId = formData.get('companyId') as string || null;
    const maxQuantity = parseInt(formData.get('maxQuantity') as string) || 100;

    const features = (formData.get('features') as string).split('\n').filter(Boolean);
    const images = (formData.get('images') as string).split('\n').filter(Boolean);

    const discountType = formData.get('discountType') as DiscountType;
    const discountValue = parseFloat(formData.get('discountValue') as string) || 0;

    await prisma.product.update({
        where: { id },
        data: {
            name: { en: nameEn, ar: nameAr },
            description: { en: descriptionEn, ar: descriptionAr },
            price,
            categoryId,
            companyId,
            maxQuantity,
            features,
            images,
            discountType,
            discountValue
        },
    });

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
}
