
'use client';

import AdminSidebar from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    return (
        <div className="min-h-screen bg-gray-50/50">
            <AdminSidebar />
            <main className={`min-h-screen transition-all duration-200 ${isLoginPage ? 'pl-0' : 'pl-64'}`}>
                <div className={`mx-auto ${isLoginPage ? '' : 'max-w-7xl p-8'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
