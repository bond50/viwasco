'use server';
import 'server-only';

import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_NAV_TAG } from '@/lib/cache/tags';
import { failSoftPublicQuery } from '@/lib/data/public/failsafe';

export type NavAboutData = {
  hasValues: boolean;
  hasMissionVision: boolean;
  hasMetrics: boolean;
  hasMilestones: boolean;
  hasFaqs: boolean;
  hasAwards: boolean;
  hasCerts: boolean;
  hasTestimonials: boolean;
  hasPartners: boolean;
  hasLeadershipTeam: boolean;
  hasMessage: boolean;
  docCats: ReadonlyArray<{ name: string; slug: string }>;
};

export async function fetchAboutForNav(): Promise<NavAboutData> {
  'use cache';
  cacheLife('hours');
  cacheTag(ABOUT_NAV_TAG);

  const [
    valuesCount,
    metricsCount,
    milestonesCount,
    faqsCount,
    awardsCount,
    certsCount,
    testimonialsCount,
    partnersCount,
    leadershipTeamCount,
    messageCount,
    missionVisionCount,
    docCats,
  ] = await failSoftPublicQuery(
    Promise.all([
      db.organizationValue.count(),
      db.organizationMetric.count({ where: { published: true } }),
      db.organizationMilestone.count(),
      db.organizationFaq.count({ where: { published: true } }),
      db.organizationAward.count(),
      db.organizationCertification.count(),
      db.organizationTestimonial.count({ where: { published: true } }),
      db.partner.count({ where: { isActive: true } }),
      db.managementTeam.count({ where: { isActive: true } }),
      db.organizationMessage.count({ where: { published: true } }),
      db.organization.count({
        where: {
          OR: [
            { vision: { not: null } },
            { mission: { not: null } },
          ],
        },
      }),
      db.documentCategory.findMany({
        where: { isActive: true, documents: { some: { published: true } } },
        select: { name: true, slug: true },
        orderBy: { rank: 'asc' },
      }),
    ]),
    {
      label: 'fetchAboutForNav',
      fallback: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, []] as const,
    },
  );

  return {
    hasValues: valuesCount > 0,
    hasMissionVision: missionVisionCount > 0,
    hasMetrics: metricsCount > 0,
    hasMilestones: milestonesCount > 0,
    hasFaqs: faqsCount > 0,
    hasAwards: awardsCount > 0,
    hasCerts: certsCount > 0,
    hasTestimonials: testimonialsCount > 0,
    hasPartners: partnersCount > 0,
    hasLeadershipTeam: leadershipTeamCount > 0,
    hasMessage: messageCount > 0,
    docCats,
  };
}
