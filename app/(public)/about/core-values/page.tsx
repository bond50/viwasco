// app/(public)/about/core-values/page.tsx
import type { Metadata } from 'next';

import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

import { CoreValuesDetail } from '@/components/public/about/core-values/details';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Core Values | ${SITE.shortName}`;
  const description = 'Our core values that guide how we deliver water and sanitation services.';

  return generatePageMetadata({
    title,
    description,
    path: '/about/core-values',
    type: 'website',
  });
}

export default async function ValuesPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Core Values', item: '/about/core-values' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Core Values | ${SITE.shortName}`}
        description="Our core values that guide how we deliver water and sanitation services."
        path="/about/core-values"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Core Values" items={breadcrumbLinks} />

      {/* Self-fetching */}
      <CoreValuesDetail />
    </main>
  );
}
