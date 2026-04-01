import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

import { getPaginatedNewsletters } from '@/lib/data/public/newsletters/getters';
import { NewsletterList } from '@/components/public/newsletters/newsletter-list.client';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Newsletters | ${SITE.shortName}`,
    description: 'Monthly newsletters and community updates.',
    path: '/newsletters',
    type: 'website',
  });
}

type PageProps = {
  searchParams?: Promise<{ category?: string; page?: string }>;
};

async function NewslettersContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const category = params.category || undefined;
  const pageParam = params.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 6;
  const {
    items,
    totalPages,
    page: safePage,
    categories,
  } = await getPaginatedNewsletters(category, Number.isFinite(page) ? page : 1, pageSize);

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Newsletters', item: '/newsletters' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`Newsletters | ${SITE.shortName}`}
        description="Monthly newsletters and community updates."
        path="/newsletters"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Newsletters" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <NewsletterList
            items={items}
            categories={categories}
            activeCategory={category}
            basePath="/newsletters"
            totalPages={totalPages}
            page={safePage}
          />
        </div>
      </Section>
    </>
  );
}

export default function NewslettersPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading newsletters…</div>}>
        <NewslettersContent {...props} />
      </Suspense>
    </main>
  );
}
