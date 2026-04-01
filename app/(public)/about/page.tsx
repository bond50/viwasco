// app/(public)/about/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { pickImageUrl } from '@/lib/public/media';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { getOrganizationOverview } from '@/lib/data/public/about/getters';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

import { AboutOverviewSection } from '@/components/public/about/about-overview';
import { AboutOverviewSkeleton } from '@/components/public/about/about-overview/skeleton';

import { PartnersStripSkeleton } from '@/components/public/about/partners/partners-strip-skeleton';
import { PartnersStripSection } from '@/components/public/about/partners';

import { CoreValuesDetail } from '@/components/public/about/core-values/details';
import { CoreValuesDetailSkeleton } from '@/components/public/about/core-values/skeleton';
import { FaqsSkeleton } from '@/components/public/about/faqs/skeleton';
import { FaqsSection } from '@/components/public/about/faqs';
import { TestimonialsStripSkeleton } from '@/components/public/about/testimonials/skeleton';
import { TestimonialsStripSection } from '@/components/public/about/testimonials';

export async function generateMetadata(): Promise<Metadata> {
  const org = await getOrganizationOverview();

  const title = org?.shortName ? `About ${org.shortName}` : `About ${SITE.shortName}`;
  const description = org?.description || SITE.description;
  const heroImage = pickImageUrl(org?.bannerImage ?? org?.featuredImage) ?? SITE.defaultOg;

  return generatePageMetadata({
    title,
    description,
    path: '/about',
    image: heroImage,
    type: 'website',
  });
}

// ---- Page ----
export default async function AboutOverviewPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ];

  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`About ${SITE.shortName}`}
        description={SITE.description}
        path="/about"
        type="website"
        showOrganization
        breadcrumbItems={breadcrumbItems}
        aboutPageProps={{
          title: `About ${SITE.shortName}`,
          description: SITE.description,
          url: '/about',
        }}
      />

      <Breadcrumb pageTitle={`About ${SITE.shortName}`} items={breadcrumbLinks} />

      {/* 1) Who we are / overview */}
      <Suspense fallback={<AboutOverviewSkeleton />}>
        <AboutOverviewSection />
      </Suspense>
      <Suspense fallback={<PartnersStripSkeleton />}>
        <PartnersStripSection />
      </Suspense>

      <Suspense fallback={<CoreValuesDetailSkeleton />}>
        <CoreValuesDetail />
      </Suspense>

      <Suspense fallback={<TestimonialsStripSkeleton />}>
        <TestimonialsStripSection />
      </Suspense>

      <Suspense fallback={<FaqsSkeleton />}>
        <FaqsSection />
      </Suspense>
    </main>
  );
}
