import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { ResourceListContent } from '@/components/public/resources/resource-list';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Strategic Plan | ${SITE.shortName}`,
    description: 'Learn about our medium-term priorities and growth roadmap.',
    path: '/resources/strategic-plan',
    type: 'website',
  });
}

type PageProps = {
  searchParams?: Promise<{ category?: string; page?: string }>;
};

async function ResourceContent({ searchParams }: PageProps) {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Resources', item: '/resources' },
    { name: 'Strategic Plan', item: '/resources/strategic-plan' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`Strategic Plan | ${SITE.shortName}`}
        description="Learn about our medium-term priorities and growth roadmap."
        path="/resources/strategic-plan"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Strategic Plan" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <ResourceListContent
            kind="strategic-plan"
            title="Strategic Plan"
            description="Learn about our medium-term priorities and growth roadmap."
            path="/resources/strategic-plan"
            searchParams={searchParams}
          />
        </div>
      </Section>
    </>
  );
}

export default function ResourcePage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading resources…</div>}>
        <ResourceContent {...props} />
      </Suspense>
    </main>
  );
}
