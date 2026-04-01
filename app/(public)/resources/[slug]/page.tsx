import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { ResourceListContent } from '@/components/public/resources/resource-list';
import { getResourceSectionBySlug } from '@/lib/data/public/resources/getters';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ category?: string; page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = await getResourceSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  return generatePageMetadata({
    title: `${section.name} | ${SITE.shortName}`,
    description: section.summary ?? undefined,
    path: `/resources/${slug}`,
    type: 'website',
  });
}

async function ResourceContent({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const section = await getResourceSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Resources', item: '/resources' },
    { name: section.name, item: `/resources/${slug}` },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`${section.name} | ${SITE.shortName}`}
        description={section.summary ?? undefined}
        path={`/resources/${slug}`}
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle={section.name} items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <ResourceListContent
            kind={slug}
            title={section.name}
            description={section.summary}
            path={`/resources/${slug}`}
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
