import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hasAuthToken = request.cookies.has('auth-token');
  const path = request.nextUrl.pathname;

  if (path === '/' && !hasAuthToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (path === '/auth' && hasAuthToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth'],
};
