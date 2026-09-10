import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('bitcoinpro_session')?.value;
  const isAuthenticated = session === 'active';

  // 1. Admin panel is permanently deleted: any attempt to access /admin redirects to /
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Strict Route Protection:
  // If user is not logged in, only the main website page (/) and auth entry points are accessible.
  // All other routes (like /dashboard and protected routes) are strictly blocked and redirected to /.
  if (!isAuthenticated) {
    const isPublicAllowed =
      pathname === '/' ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.');

    if (!isPublicAllowed) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('unauthorized', '1');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. If already logged in and visiting /login or /register, redirect to /dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
