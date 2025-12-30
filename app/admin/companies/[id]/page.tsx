
import { prisma } from '@/src/lib/prisma';
import { updateCompany } from '../actions';
import CompanyForm from '../_components/CompanyForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditCompanyPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const company = await prisma.company.findUnique({
        where: { id: params.id }
    });

    if (!company) {
        notFound();
    }

    const updateAction = updateCompany.bind(null, company.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/companies" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">Edit Company</h1>
            </div>

            <CompanyForm action={updateAction} initialData={company} />
        </div>
    );
}
