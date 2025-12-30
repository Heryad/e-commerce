
'use server';

import { login } from '@/src/lib/session';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // STATIC CREDENTIALS
    if (username === 'admin' && password === 'admin123') {
        await login(formData);
        redirect('/admin');
    } else {
        return { error: 'Invalid username or password' };
    }
}
