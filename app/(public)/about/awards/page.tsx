import type { Metadata } from 'next';

import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { getAwards } from '@/lib/data/public/about/getters';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { AwardsGrid } from '@/components/public/about/awards';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Awards | ${SITE.shortName}`;
  const description = 'Awards and recognitions received by the utility.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/awards',
    type: 'website',
  });
}

export default async function AwardsPage() {
  const awards = await getAwards();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Awards', item: '/about/awards' },
  ];

  return (
    <>
      <PageSeo
        title={`Awards | ${SITE.shortName}`}
        description="Awards and recognitions received by the utility."
        path="/about/awards"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Awards" items={toUiBreadcrumbs(breadcrumbItems)} />

      <AwardsGrid items={awards} />
    </>
  );
}
