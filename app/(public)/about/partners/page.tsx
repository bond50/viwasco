// app/(public)/about/partners/page.tsx

import type { Metadata } from 'next';

import { getPartners } from '@/lib/data/public/about/getters';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import {
  type UploadedImageResponse,
  uploadedImageResponseSchema,
} from '@/lib/schemas/shared/image';
import type { PartnershipType } from '@/lib/schemas/about/content/partners';
import { PartnersGrid } from '@/components/public/about/partners-grid';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Partners | ${SITE.shortName}`;
  const description = 'Partner organizations that work with the utility.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/partners',
    type: 'website',
  });
}

// Small helper so TS understands logo shape
function toUploadedImage(logo: unknown): UploadedImageResponse | null {
  const parsed = uploadedImageResponseSchema.safeParse(logo);
  return parsed.success ? parsed.data : null;
}

type PartnerCard = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo: UploadedImageResponse | null;
  partnershipType: PartnershipType;
};

export default async function PartnersPage() {
  const partners = await getPartners();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Partners', item: '/about/partners' },
  ];

  const itemListProps =
    partners.length > 0
      ? {
          name: `Partners — ${SITE.shortName}`,
          description: 'Organizations that collaborate with the utility.',
          url: '/about/partners',
          items: partners.map((p, index) => ({
            name: p.name,
            url: `/about/partners#partner-${p.slug}`,
            position: index + 1,
          })),
        }
      : undefined;

  const partnerCards: PartnerCard[] = partners.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? null,
    website: p.website ?? null,
    logo: toUploadedImage(p.logo),
    partnershipType: p.partnershipType,
  }));

  return (
    <main>
      <PageSeo
        title={`Partners | ${SITE.shortName}`}
        description="Partner organizations that work with the utility."
        path="/about/partners"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={itemListProps}
      />

      <Breadcrumb pageTitle="Partners" items={toUiBreadcrumbs(breadcrumbItems)} />

      <PartnersGrid partners={partnerCards} />
    </main>
  );
}
