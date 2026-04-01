// app/(public)/about/faqs/page.tsx
import type { Metadata } from 'next';

import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

import { FaqsSection } from '@/components/public/about/faqs';

export async function generateMetadata(): Promise<Metadata> {
  const title = `FAQs | ${SITE.shortName}`;
  const description = 'Frequently asked questions about water and sanitation services.';

  return generatePageMetadata({
    title,
    description,
    path: '/about/faqs',
    type: 'website',
  });
}

export default async function FaqsPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'FAQs', item: '/about/faqs' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`FAQs | ${SITE.shortName}`}
        description="Frequently asked questions about water and sanitation services."
        path="/about/faqs"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="FAQs" items={breadcrumbLinks} />

      {/* ✅ self-fetching section */}
      <FaqsSection />
    </main>
  );
}
