// app/(public)/about/testimonials/page.tsx
import type { Metadata } from 'next';

import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

import { TestimonialsSection } from '@/components/public/about/testimonials';
import { TestimonialsGridSkeleton } from '@/components/public/about/testimonials/skeleton';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Testimonials | ${SITE.shortName}`;
  const description = 'What customers and stakeholders say about our services.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/testimonials',
    type: 'website',
  });
}

export default async function TestimonialsPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Testimonials', item: '/about/testimonials' },
  ];

  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Testimonials | ${SITE.shortName}`}
        description="What customers and stakeholders say about our services."
        path="/about/testimonials"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Testimonials" items={breadcrumbLinks} />

      <Section background="default" padding="lg">
        <div className="container">
          <div className="section-title text-center mb-4">
            <h2>Testimonials</h2>
            <p className="text-muted">
              Feedback and stories from customers, partners, and community members who interact with
              our services.
            </p>
          </div>

          {/* ✅ self-fetching grid section */}
          <Suspense fallback={<TestimonialsGridSkeleton />}>
            <TestimonialsSection />
          </Suspense>
        </div>
      </Section>
    </main>
  );
}
