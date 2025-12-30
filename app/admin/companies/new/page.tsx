
import { createCompany } from '../actions';
import CompanyForm from '../_components/CompanyForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCompanyPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/companies" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-bold">New Company</h1>
            </div>

            <CompanyForm action={createCompany} />
        </div>
    );
}
