// lib/seo/origin.server.ts
import 'server-only';

/** Resolve public site origin (with scheme). */
export function resolveOrigin(): string {
  // common hosts (Vercel exposes VERCEL_URL without scheme)
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CLIENT_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';

  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

/** Make any path/URL absolute against the resolved origin. */
export function absUrl(pathOrUrl?: string | null): string {
  const base = resolveOrigin();
  if (!pathOrUrl) return base;
  try {
    return new URL(pathOrUrl, base).toString();
  } catch {
    const b = base.replace(/\/+$/, '');
    const p = String(pathOrUrl).startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${b}${p}`;
  }
}
