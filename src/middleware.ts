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

  // If trying to access a protected route without a token, redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    // loginUrl.searchParams.set('from', pathname) // Optional: save where they were going
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in and trying to access /login OR / (landing page), redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
