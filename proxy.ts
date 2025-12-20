// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hasAuthToken = request.cookies.has('auth-token');
  const path = request.nextUrl.pathname;

  // Root path: redirect based on auth status
  if (path === '/') {
    if (hasAuthToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Auth page: if logged in, go to dashboard
  if (path === '/auth' && hasAuthToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Dashboard: if not logged in, go to auth
  if (path.startsWith('/dashboard') && !hasAuthToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth', '/dashboard/:path*'],
};