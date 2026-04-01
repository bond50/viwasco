import { absUrl } from '@/lib/seo/origin.server';
import { SITE } from '@/lib/seo/config';

// Keep the same props shape you already had
export interface PageSeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

/**
 * Server-side helper that returns a Next.js Metadata object
 * based on our site config + per-page SEO settings.
 */
export async function generatePageMetadata(props: PageSeoProps) {
  const { title, description, path = '/', image, type = 'website', noindex = false } = props;

  const pageUrl = absUrl(path);
  const ogImage = absUrl(image || SITE.defaultOg);
  const desc = description || SITE.description;

  return {
    title,
    description: desc,
    alternates: { canonical: pageUrl },
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type,
      url: pageUrl,
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
