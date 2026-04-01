// app/(public)/about/mission-vision/page.tsx
import type { Metadata } from 'next';

import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { VisionMission } from '@/components/public/about/vision-mission';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Mission & Vision | ${SITE.shortName}`;
  const description = 'Our mission and vision guide how we serve our customers and community.';

  return generatePageMetadata({
    title,
    description,
    path: '/about/mission-vision',
    type: 'website',
  });
}

export default async function MissionVisionPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Mission & Vision', item: '/about/mission-vision' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Mission & Vision | ${SITE.shortName}`}
        description="Our mission and vision guide how we serve our customers and community."
        path="/about/mission-vision"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Mission & Vision" items={breadcrumbLinks} />

      {/* Self-fetching */}
      <VisionMission />
    </main>
  );
}
