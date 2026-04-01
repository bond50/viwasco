// proxy.ts
import type { Session } from 'next-auth';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  forbiddenRoute,
  isProtectedPath,
  mfaRoute,
  unauthorizedRoute,
} from '@/routes';
import { UserRole } from '@/generated/prisma/client';

export const proxy = auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth as Session | null;
  const isLoggedIn = !!session;

  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    return NextResponse.next();
  }

  if (pathname === mfaRoute) {
    if (!isLoggedIn) {
      const cb = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${cb}`, nextUrl));
    }
    if (session.mfaVerified) {
      const nextParam = nextUrl.searchParams.get('next');
      const dest = nextParam && nextParam.startsWith('/') ? nextParam : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(dest, nextUrl));
    }
    return NextResponse.next();
  }

  // Auth pages (login/register/etc.)
  const isAuthRoute = authRoutes.includes(pathname);
  if (isAuthRoute) {
    if (!isLoggedIn) {
      return NextResponse.next();
    }

    // ⛔ If logged in but NOT ADMIN (e.g., OAuth session), do NOT step up to MFA.
    // Send them to the friendly 403 instead.
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(forbiddenRoute, nextUrl));
    }

    if (session.mfaVerified) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    const cb = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(new URL(`${mfaRoute}?next=${cb}`, nextUrl));
  }

  if (isProtectedPath(pathname)) {
    if (!isLoggedIn) {
      const cb = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${cb}`, nextUrl));
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(forbiddenRoute, nextUrl));
    }
    if (session.mfaRequired && !session.mfaVerified) {
      const cb = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
      return NextResponse.redirect(new URL(`${mfaRoute}?next=${cb}`, nextUrl));
    }
  }

  // Explicitly allow Forbidden & Unauthorized pages
  if (pathname === forbiddenRoute || pathname === unauthorizedRoute) {
    if (isLoggedIn && session.user.role === UserRole.ADMIN) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
