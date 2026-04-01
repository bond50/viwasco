import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { CareerListContent } from '@/components/public/careers/career-list';
import { getPaginatedCareers } from '@/lib/data/public/careers/getters';

type PageProps = {
  searchParams?: Promise<{ type?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const typeParam = params.type;
  const { items, types } = await getPaginatedCareers(typeParam || undefined, 1, 1);
  const typeLabel = typeParam ? types.find((item) => item.slug === typeParam)?.label : null;

  return generatePageMetadata({
    title: typeLabel ? `${typeLabel} | Careers | ${SITE.shortName}` : `Careers | ${SITE.shortName}`,
    description: items[0]
      ? `${items[0].title} opening at ${items[0].department} in ${items[0].location}.`
      : 'Explore current vacancies and internship opportunities.',
    path: '/careers',
    type: 'website',
  });
}

async function CareerContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const typeParam = params.type;
  const pageParam = params.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 6;
  const { items: seoItems } = await getPaginatedCareers(
    typeParam || undefined,
    Number.isFinite(page) ? page : 1,
    pageSize,
  );

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Careers', item: '/careers' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`Careers | ${SITE.shortName}`}
        description={
          seoItems[0]
            ? `${seoItems[0].title} opening at ${seoItems[0].department} in ${seoItems[0].location}.`
            : 'Explore current vacancies and internship opportunities.'
        }
        path="/careers"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={{
          name: 'Careers',
          description: 'Current vacancies and internship opportunities.',
          url: '/careers',
          items: seoItems.slice(0, 8).map((item, index) => ({
            name: item.title,
            url: item.pdfUrl,
            position: index + 1,
          })),
        }}
      />

      <Breadcrumb pageTitle="Careers" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <CareerListContent
            title="Open Positions"
            description="Explore current vacancies and internship opportunities."
            path="/careers"
            searchParams={searchParams}
          />
        </div>
      </Section>
    </>
  );
}

export default function CareersPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading careers…</div>}>
        <CareerContent {...props} />
      </Suspense>
    </main>
  );
}
