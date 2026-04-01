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
    title: `Downloads | ${SITE.shortName}`,
    description: 'Forms, guidelines, and downloadable resources for customers.',
    path: '/resources/downloads',
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
    { name: 'Downloads', item: '/resources/downloads' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`Downloads | ${SITE.shortName}`}
        description="Forms, guidelines, and downloadable resources for customers."
        path="/resources/downloads"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Downloads" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <ResourceListContent
            kind="downloads"
            title="Downloads"
            description="Forms, guidelines, and downloadable resources for customers."
            path="/resources/downloads"
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
