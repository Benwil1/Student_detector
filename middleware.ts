import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Define public and protected paths
  // Public: /, /login, /pricing (maybe), /about
  // Protected: /dashboard, /editor, /profile, /notifications
  
  const isProtected = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/editor') || 
    pathname.startsWith('/profile') ||
    pathname.startsWith('/notifications');

  // 1. If trying to access a protected route without a token, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If already logged in and trying to access /login, redirect to dashboard
  // Note: We don't redirect away from '/' (landing page) because user might want to see Home
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /favicon.ico, /robots.txt, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
