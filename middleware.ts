
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/src/lib/session';

export async function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return await updateSession(request);
        }

        // Check for session cookie
        const session = request.cookies.get('session');

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        return await updateSession(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
