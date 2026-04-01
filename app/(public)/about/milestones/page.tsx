import type { Metadata } from 'next';
import { getMilestones } from '@/lib/data/public/about/getters';
import { Timeline } from '@/components/public/about/timeline';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Milestones | ${SITE.shortName}`;
  const description = 'Key milestones and history of the water and sanitation utility.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/milestones',
    type: 'website',
  });
}

export default async function MilestonesPage() {
  const items = await getMilestones();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Milestones', item: '/about/milestones' },
  ];

  const itemListProps =
    items.length > 0
      ? {
          name: `Milestones — ${SITE.shortName}`,
          description: 'Timeline of major events and achievements.',
          url: '/about/milestones',
          items: items.map((m, index) => ({
            name: m.title,
            url: `/about/milestones#milestone-${m.id}`,
            position: index + 1,
          })),
        }
      : undefined;

  return (
    <main>
      <PageSeo
        title={`Milestones | ${SITE.shortName}`}
        description="Key milestones and history of the water and sanitation utility."
        path="/about/milestones"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={itemListProps}
      />

      <Breadcrumb pageTitle="Milestones" items={toUiBreadcrumbs(breadcrumbItems)} />

      <Timeline items={items} />
    </main>
  );
}
