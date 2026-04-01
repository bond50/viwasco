// lib/seo/jsonld-schemas.ts
import type { SiteConfig } from './config';
import { SITE } from './config';
import { absUrl } from './origin.server';

export function orgJsonLd(site: SiteConfig = SITE) {
  const sameAs = [
    site.social.facebook,
    site.social.twitter && site.social.twitter.startsWith('http') ? site.social.twitter : undefined,
    site.social.linkedin,
    site.social.youtube,
    site.social.instagram,
  ].filter(Boolean) as string[];

  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: site.name,
    description: site.description,
    url: site.url,
    logo: absUrl(site.logo.square || site.logo.light),
    areaServed: site.serviceAreas,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      streetAddress: site.contacts.address,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.contacts.hotline || site.contacts.phone,
        contactType: 'customer service',
        areaServed: site.serviceAreas,
        availableLanguage: ['en', 'sw'],
      },
    ],
    sameAs,
  };
}

export function breadcrumbJsonLd({ items }: { items: { name: string; item: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absUrl(item.item),
    })),
  };
}

export function personJsonLd({
  name,
  url,
  jobTitle,
  image,
  sameAs = [],
}: {
  name: string;
  url: string;
  jobTitle?: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: absUrl(url),
    jobTitle,
    image: image ? absUrl(image) : undefined,
    sameAs,
  };
}

export function aboutPageJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'AboutPage'],
    name: title,
    url: absUrl(url),
    description,
  };
}

export function itemListJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string; position?: number }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url: absUrl(url),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      name: item.name,
      url: absUrl(item.url),
    })),
  };
}

export function pageJsonLd({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}) {
  const schemaType =
    type === 'article' ? 'Article' : type === 'profile' ? 'ProfilePage' : 'WebPage';

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title,
    headline: title,
    description,
    url: absUrl(path || '/'),
    image: image ? [absUrl(image)] : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    articleSection: section,
    keywords: tags,
  };
}
