
'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCompany(formData: FormData) {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const slug = formData.get('slug') as string;
    const image = formData.get('image') as string;
    const sorting = parseInt(formData.get('sorting') as string) || 0;

    await prisma.company.create({
        data: {
            name: { en: nameEn, ar: nameAr },
            slug,
            image,
            sorting
        },
    });

    revalidatePath('/admin/companies');
    redirect('/admin/companies');
}

export async function updateCompany(id: string, formData: FormData) {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const slug = formData.get('slug') as string;
    const image = formData.get('image') as string;
    const sorting = parseInt(formData.get('sorting') as string) || 0;

    await prisma.company.update({
        where: { id },
        data: {
            name: { en: nameEn, ar: nameAr },
            slug,
            image,
            sorting
        },
    });

    revalidatePath('/admin/companies');
    redirect('/admin/companies');
}

export async function deleteCompany(id: string) {
    await prisma.company.delete({ where: { id } });
    revalidatePath('/admin/companies');
}
