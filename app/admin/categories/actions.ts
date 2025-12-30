
'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const slug = formData.get('slug') as string;
    const image = formData.get('image') as string;
    const sorting = parseInt(formData.get('sorting') as string) || 0;

    await prisma.category.create({
        data: {
            name: { en: nameEn, ar: nameAr },
            slug,
            image,
            sorting
        },
    });

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const slug = formData.get('slug') as string;
    const image = formData.get('image') as string;
    const sorting = parseInt(formData.get('sorting') as string) || 0;

    await prisma.category.update({
        where: { id },
        data: {
            name: { en: nameEn, ar: nameAr },
            slug,
            image,
            sorting
        },
    });

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}
