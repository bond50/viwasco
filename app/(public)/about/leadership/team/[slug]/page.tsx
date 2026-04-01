import type { Metadata } from 'next';
import { Suspense } from 'react';

import { generatePageMetadata } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';

import { getBestImageUrl } from '@/lib/assets/core';
import { Section } from '@/components/reusables/sections/section';

import { LeadershipMemberPageInner } from './_page-inner';
import { getActiveTeamMemberWithRelated } from '@/lib/data/public/about/getters';

type PageParams = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;

  const data = await getActiveTeamMemberWithRelated(slug);

  if (!data) {
    const title = `Leader not found | ${SITE.shortName}`;
    const description = 'The requested leadership profile could not be found.';
    return generatePageMetadata({
      title,
      description,
      path: `/about/leadership/team/${slug}`,
      type: 'website',
    });
  }

  const { member } = data;
  const title = `${member.name} — ${member.position} | ${SITE.shortName}`;
  const description = member.bio
    ? member.bio.length > 150
      ? `${member.bio.slice(0, 147)}...`
      : member.bio
    : undefined;

  const imageUrl =
    getBestImageUrl(member.image, ['square', 'medium', 'small', 'thumb']) ?? undefined;

  return generatePageMetadata({
    title,
    description,
    path: `/about/leadership/team/${member.slug}`,
    type: 'profile',
    image: imageUrl,
  });
}

export default function LeadershipMemberPage(props: PageParams) {
  return (
    <Suspense
      fallback={
        <main>
          <Section background="default" padding="lg">
            <div className="container py-5 text-center text-muted">
              Loading leadership profile...
            </div>
          </Section>
        </main>
      }
    >
      <LeadershipMemberPageInner {...props} />
    </Suspense>
  );
}
