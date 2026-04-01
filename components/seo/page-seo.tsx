// components/seo/page-seo.tsx

import { JsonLd } from './JsonLd';
import {
  aboutPageJsonLd,
  breadcrumbJsonLd,
  itemListJsonLd,
  orgJsonLd,
  pageJsonLd,
  personJsonLd,
} from '@/lib/seo/jsonld-schemas';
import { SITE } from '@/lib/seo/config';
import { absUrl } from '@/lib/seo/origin.server';

interface PageStructuredDataPerson {
  name: string;
  url: string;
  jobTitle?: string;
  image?: string;
  sameAs?: string[];
}

interface PageStructuredDataItemList {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string; position?: number }[];
}

interface PageSeoProps {
  // Basic (used only for consistency; actual <head> is from generateMetadata)
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];

  // Structured Data
  breadcrumbItems?: { name: string; item: string }[];
  showOrganization?: boolean;
  persons?: PageStructuredDataPerson[];

  // About page JSON-LD (e.g. /about)
  aboutPageProps?: {
    title: string;
    description: string;
    url: string; // can be '/about'
  };

  // ItemList JSON-LD (e.g. leadership team, partners)
  itemListProps?: PageStructuredDataItemList;
}

export function PageSeo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  section,
  tags,
  breadcrumbItems,
  showOrganization = false,
  persons = [],
  aboutPageProps,
  itemListProps,
}: PageSeoProps) {
  const structuredData: Record<string, unknown>[] = [];

  structuredData.push(
    pageJsonLd({
      title,
      description,
      path,
      image,
      type,
      publishedTime,
      modifiedTime,
      section,
      tags,
    }),
  );

  // Organization JSON-LD (brand / Knowledge Panel)
  if (showOrganization) {
    structuredData.push(orgJsonLd(SITE));
  }

  // AboutPage JSON-LD
  if (aboutPageProps) {
    structuredData.push(
      aboutPageJsonLd({
        title: aboutPageProps.title,
        description: aboutPageProps.description,
        url: aboutPageProps.url,
      }),
    );
  }

  // BreadcrumbList JSON-LD
  if (breadcrumbItems && breadcrumbItems.length > 0) {
    structuredData.push(breadcrumbJsonLd({ items: breadcrumbItems }));
  }

  // Person JSON-LD (optional)
  persons.forEach((person) => {
    structuredData.push(personJsonLd(person));
  });

  // ItemList JSON-LD (leadership, partners, docs, etc.)
  if (itemListProps && itemListProps.items.length > 0) {
    structuredData.push(
      itemListJsonLd({
        name: itemListProps.name,
        description: itemListProps.description,
        url: itemListProps.url,
        items: itemListProps.items,
      }),
    );
  }

  return (
    <>
      {structuredData.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}

      {/* You already set robots in generateMetadata; no need to repeat here.
          Keeping `noindex` here is optional, but harmless. */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}

// ---- Server helper for app router metadata (<head>) ----

export async function generatePageMetadata(props: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}) {
  const {
    title,
    description,
    path = '/',
    image,
    type = 'website',
    noindex,
    publishedTime,
    modifiedTime,
    section,
    tags,
  } = props;

  const canonical = absUrl(path);
  const desc = description || SITE.description;
  const ogImage = absUrl(image || SITE.defaultOg);

  return {
    title,
    description: desc,
    alternates: { canonical },
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      title,
      description: desc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            section,
            tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.social.twitter,
      creator: SITE.social.twitter,
      title,
      description: desc,
      images: [ogImage],
    },
  };
}
