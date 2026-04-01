import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { TenderListContent } from '@/components/public/tenders/tender-list';
import {
  getPaginatedTenders,
  type TenderStatus,
  tenderStatuses,
} from '@/lib/data/public/tenders/getters';

type PageProps = {
  searchParams?: Promise<{ status?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const statusParam = params.status as TenderStatus | undefined;
  const status = tenderStatuses.find((item) => item.id === statusParam) ?? null;
  const { items } = await getPaginatedTenders(statusParam, 1, 1);
  const first = items[0];

  return generatePageMetadata({
    title: status ? `${status.label} | ${SITE.shortName}` : `Tenders | ${SITE.shortName}`,
    description: first?.summary || 'Open tenders, procurement notices, and bidding documents.',
    path: '/tenders',
    type: 'website',
  });
}

async function TenderContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const statusParam = params.status as TenderStatus | undefined;
  const pageParam = params.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 6;
  const { items: seoItems } = await getPaginatedTenders(
    statusParam,
    Number.isFinite(page) ? page : 1,
    pageSize,
  );

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Tenders', item: '/tenders' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`Tenders | ${SITE.shortName}`}
        description={
          seoItems[0]?.summary || 'Open tenders, procurement notices, and bidding documents.'
        }
        path="/tenders"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={{
          name: 'Tenders',
          description: 'Open tenders, procurement notices, and bidding documents.',
          url: '/tenders',
          items: seoItems.slice(0, 8).map((item, index) => ({
            name: item.title,
            url: item.downloadUrl,
            position: index + 1,
          })),
        }}
      />

      <Breadcrumb pageTitle="Tenders" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <TenderListContent
            title="Open Tenders"
            description="Open tenders, procurement notices, and bidding documents."
            path="/tenders"
            searchParams={searchParams}
          />
        </div>
      </Section>
    </>
  );
}

export default function TendersPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading tenders…</div>}>
        <TenderContent {...props} />
      </Suspense>
    </main>
  );
}
