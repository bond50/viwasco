import type { Metadata } from 'next';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

import { LeadershipTeamSection } from '@/components/public/about/leadership-team-section';
import { getTeamCategoriesWithActiveMembers } from '@/lib/data/public/about/getters';

// New: reusable section wrappers
import { Section } from '@/components/reusables/sections/section';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Leadership — Team | ${SITE.shortName}`;
  const description =
    'Meet the leadership team responsible for delivering safe, reliable water and sanitation services.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/leadership/team',
    type: 'website',
  });
}

export default async function LeadershipTeamPage() {
  const categories = await getTeamCategoriesWithActiveMembers();
  const hasCategories = categories.length > 0;

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Leadership — Team', item: '/about/leadership/team' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  // Schema.org ItemList based on flat members (for SEO)
  const flatMembers = categories
    .flatMap((c) => c.teamMembers ?? [])
    .filter((m) => m && m.name && m.slug);

  const itemListProps =
    flatMembers.length > 0
      ? {
          name: `Leadership Team — ${SITE.shortName}`,
          description:
            'List of management and executive leaders for the water and sanitation utility.',
          url: '/about/leadership/team',
          items: flatMembers.map((member, index) => ({
            name: member.name,
            url: `/about/leadership/team#${member.slug}`,
            position: index + 1,
          })),
        }
      : undefined;

  return (
    <main>
      <PageSeo
        title={`Leadership — Team | ${SITE.shortName}`}
        description="Meet the leadership team responsible for delivering safe, reliable water and sanitation services."
        path="/about/leadership/team"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={itemListProps}
      />

      <Breadcrumb pageTitle="Leadership — Team" items={breadcrumbLinks} />

      {/* If no categories/team members, show a friendly empty state */}
      {!hasCategories && (
        <Section background="light" padding="lg">
          <div className="container text-center py-4">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <h3 className="h4 mb-3">Leadership Information Coming Soon</h3>
                <p className="text-muted mb-0">
                  Our leadership team information is currently being updated. Please check back
                  soon.
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Render categories + team sections only if we have data */}
      {hasCategories &&
        categories.map((category, index) => (
          <LeadershipTeamSection key={category.id} category={category} index={index} />
        ))}
    </main>
  );
}
