// lib/seo/metadata.ts
import type { Metadata } from 'next';
import { SITE } from './config';
import { absUrl, resolveOrigin } from '@/lib/seo/origin.server';

/** Default site-wide metadata (absolute URLs for OG/Twitter). */
export function defaultMetadata(): Metadata {
  const metadataBase = new URL(resolveOrigin());
  const defaultOgAbs = absUrl(SITE.defaultOg);

  // prefer a URL string for openGraph.url
  const siteUrlAbs = absUrl('/');

  // Prefer a handle (e.g., @VIWASCO) if provided; otherwise undefined
  const twitterHandle =
    SITE.social.twitter && SITE.social.twitter.startsWith('@') ? SITE.social.twitter : undefined;

  return {
    metadataBase,
    title: {
      default: SITE.name,
      template: `%s — ${SITE.name}`,
    },
    description: SITE.description,
    alternates: { canonical: siteUrlAbs },
    openGraph: {
      type: 'website',
      url: siteUrlAbs,
      siteName: SITE.name,
      locale: SITE.locale,
      title: SITE.name,
      description: SITE.description,
      images: [{ url: defaultOgAbs }],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: SITE.name,
      description: SITE.description,
      images: [defaultOgAbs],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon-32x32.png',
    },
    applicationName: SITE.name,
    authors: [{ name: SITE.name }],
  };
}

/** Page-level metadata builder (relative paths become absolute). */
export function pageMetadata(opts: {
  title: string;
  description?: string | null;
  path?: string; // '/about' or absolute
  image?: string | null; // relative or absolute
  type?: 'website' | 'article' | 'profile';
}): Metadata {
  const metadataBase = new URL(resolveOrigin());
  const url = absUrl(opts.path || '/');
  const img = absUrl(opts.image || SITE.defaultOg);

  const twitterHandle =
    SITE.social.twitter && SITE.social.twitter.startsWith('@') ? SITE.social.twitter : undefined;

  return {
    metadataBase,
    title: opts.title,
    description: opts.description || SITE.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type || 'website',
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      title: opts.title,
      description: opts.description || SITE.description,
      images: [{ url: img }],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: opts.title,
      description: opts.description || SITE.description,
      images: [img],
    },
  };
}
