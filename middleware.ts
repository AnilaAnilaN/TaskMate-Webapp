// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAuthToken = request.cookies.has('auth-token');
  const path = request.nextUrl.pathname;

  // Protect dashboard (home page)
  if (path === '/' && !hasAuthToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect logged-in users away from auth page
  if (path === '/auth' && hasAuthToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth'],
};
