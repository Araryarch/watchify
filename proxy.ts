import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protects dashboard routes at the edge.
 * Since token is stored in Zustand (localStorage), we just check
 * cookie-based fallback or redirect unauthenticated users.
 * Full role enforcement happens in the RoleGuard client component.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  // Check for persisted Zustand auth storage in cookies (if SSR) or allow client guard to handle
  // We rely on the auth-storage key set by zustand/persist
  const authStorage = request.cookies.get('auth-storage')?.value;

  if (!authStorage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const parsed = JSON.parse(authStorage);
    const token = parsed?.state?.token;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
