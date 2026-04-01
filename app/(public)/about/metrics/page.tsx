// app/(public)/about/metrics/page.tsx
import type { Metadata } from 'next';
import { getMetrics } from '@/lib/data/public/about/getters';
import { MetricsGrid } from '@/components/public/about/metrics-grid';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Metrics | ${SITE.shortName}`;
  const description = 'Key performance and service delivery metrics for the utility.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/metrics',
    type: 'website',
  });
}

export default async function MetricsPage() {
  const metrics = await getMetrics();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Metrics', item: '/about/metrics' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Metrics | ${SITE.shortName}`}
        description="Key performance and service delivery metrics for the utility."
        path="/about/metrics"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Metrics" items={breadcrumbLinks} />
      <MetricsGrid items={metrics} />
    </main>
  );
}
