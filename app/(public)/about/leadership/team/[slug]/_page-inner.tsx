import { notFound } from 'next/navigation';

import { Section } from '@/components/reusables/sections/section';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { getBestImageUrl } from '@/lib/assets/core';
import { PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import {
  type ActiveTeamMemberWithRelated,
  getActiveTeamMemberWithRelated,
} from '@/lib/data/public/about/getters';
import { LeadershipMemberDetail } from '@/components/public/about/leadership-member-detail';
import {
  computeLeadershipVisibility,
  LeadershipVisibility,
} from '@/lib/about/leadership/visibility';

type ActiveTab = 'overview' | 'career' | 'publications' | 'background' | 'contact';

type PageParams = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tab?: string }>;
};

function resolveActiveTab(
  requested: string | undefined,
  flags: {
    hasOverview: boolean;
    hasCareer: boolean;
    hasPublications: boolean;
    hasBackground: boolean;
    canContact: boolean;
  },
): ActiveTab {
  const available: ActiveTab[] = [];

  if (flags.hasOverview) available.push('overview');
  if (flags.hasCareer) available.push('career');
  if (flags.hasPublications) available.push('publications');
  if (flags.hasBackground) available.push('background');
  if (flags.canContact) available.push('contact');

  const requestedLower = (requested ?? '').toLowerCase() as ActiveTab;

  // If requested tab exists and is allowed, use it
  if (requestedLower && available.includes(requestedLower)) {
    return requestedLower;
  }

  // Default: first available in priority order
  // e.g. if no overview but career exists → open "career"
  return available[0] ?? 'overview';
}

export async function LeadershipMemberPageInner({ params, searchParams }: PageParams) {
  const [{ slug }, search] = await Promise.all([params, searchParams ?? {}]);

  const data = await getActiveTeamMemberWithRelated(slug);

  if (!data) {
    notFound();
  }

  const { member, category, related, message } = data as ActiveTeamMemberWithRelated;

  const visibility: LeadershipVisibility = computeLeadershipVisibility(member, message);

  const requestedTab = (search as { tab?: string }).tab;
  const { hasOverview, hasCareer, hasPublications, hasBackground, canContact } = visibility;

  const activeTab = resolveActiveTab(requestedTab, {
    hasOverview,
    hasCareer,
    hasPublications,
    hasBackground,
    canContact,
  });

  // ----- SEO + breadcrumbs as before -----
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Leadership — Team', item: '/about/leadership/team' },
    {
      name: member.name,
      item: `/about/leadership/team/${member.slug}`,
    },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  const rawBio = member.bio ?? '';
  const description =
    rawBio.length > 0 ? (rawBio.length > 150 ? `${rawBio.slice(0, 147)}...` : rawBio) : undefined;

  const imageUrl =
    getBestImageUrl(member.image, ['square', 'medium', 'small', 'thumb']) ?? undefined;

  return (
    <main>
      <PageSeo
        title={`${member.name} — ${member.position} | ${SITE.shortName}`}
        description={description}
        path={`/about/leadership/team/${member.slug}`}
        type="profile"
        breadcrumbItems={breadcrumbItems}
        persons={[
          {
            name: member.name,
            url: `${SITE.url}/about/leadership/team/${member.slug}`,
            jobTitle: member.position,
            image: imageUrl,
            sameAs:
              member.showSocialLinks && member.socialLinks.length > 0
                ? member.socialLinks.map((link) => link.url)
                : [],
          },
        ]}
      />

      <Breadcrumb pageTitle={`Leadership — ${member.name}`} items={breadcrumbLinks} />

      <Section background="default" padding="lg">
        <div className="container">
          <LeadershipMemberDetail
            member={member}
            category={category}
            related={related}
            message={message}
            activeTab={activeTab}
          />
        </div>
      </Section>
    </main>
  );
}
