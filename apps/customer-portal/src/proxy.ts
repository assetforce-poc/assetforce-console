import { type NextRequest, NextResponse } from 'next/server';

/**
 * Auth Proxy (Next.js 16+)
 *
 * Protects routes by checking for session cookie.
 * - Public routes: /auth/*, /api/auth/*
 * - Protected routes: everything else
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no auth required
  const isPublicRoute =
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/';

  // API routes other than auth - let them handle their own auth
  const isApiRoute = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/');

  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('assetforce_session');

  if (!sessionCookie?.value) {
    // No session - redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Has session cookie - allow through
  // Note: actual session validation happens server-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
