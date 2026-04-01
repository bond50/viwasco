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
    title: `Notices | ${SITE.shortName}`,
    description: 'Public notices, service alerts, and scheduled maintenance updates.',
    path: '/resources/notices',
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
    { name: 'Notices', item: '/resources/notices' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`Notices | ${SITE.shortName}`}
        description="Public notices, service alerts, and scheduled maintenance updates."
        path="/resources/notices"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Notices" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <ResourceListContent
            kind="notices"
            title="Notices"
            description="Public notices, service alerts, and scheduled maintenance updates."
            path="/resources/notices"
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
