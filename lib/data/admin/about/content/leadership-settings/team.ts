import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { ABOUT_LEADERSHIP_CATS_TAG, ABOUT_LEADERSHIP_TEAM_TAG } from '@/lib/cache/tags';
import type { SocialLink } from '@/lib/schemas/shared/social';
import {
  AdminTeamAchievementRow,
  AdminTeamEducationRow,
  AdminTeamExperienceRow,
  AdminTeamPublicationRow,
  TeamBasicState,
  TeamContactState,
  TeamListsState,
  TeamMetadata,
  TeamProfileState,
  TeamSettingsData,
  TeamSocialState,
  UploadedImageJson,
} from '@/lib/types/about/leadership';
import { parseWorkingHours } from '@/lib/working-hours';

export async function getTeamSettings(id: string): Promise<TeamSettingsData | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);

  const row = await db.managementTeam.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      categoryId: true,
      category: { select: { id: true, name: true } },

      // Basic
      name: true,
      position: true,
      rank: true,
      isFeatured: true,
      isActive: true,
      image: true,

      // Profile (legacy)
      bio: true,
      experience: true,
      achievements: true,
      publications: true,
      metadata: true,

      // Contact
      email: true,
      phone: true,
      expertiseArea: true,
      officeLocation: true,
      workingHours: true,
      assistantContact: true,
      showEmail: true,
      showPhone: true,
      showSocialLinks: true,
      allowContact: true,

      // Lists
      languages: true,
      boardCommittees: true,
      professionalAffiliations: true,
      awards: true,

      // Social
      socialLinks: true,
    },
  });

  if (!row) return null;

  // Fetch new relational sections
  const [educations, experiences, achievements, publications] = await Promise.all([
    db.teamEducation.findMany({
      where: { teamId: id },
      orderBy: { rank: 'asc' },
    }) as Promise<AdminTeamEducationRow[]>,

    db.teamExperience.findMany({
      where: { teamId: id },
      orderBy: { rank: 'asc' },
    }) as Promise<AdminTeamExperienceRow[]>,

    db.teamAchievement.findMany({
      where: { teamId: id },
      orderBy: { rank: 'asc' },
    }) as Promise<AdminTeamAchievementRow[]>,

    db.teamPublication.findMany({
      where: { teamId: id },
      orderBy: { rank: 'asc' },
    }) as Promise<AdminTeamPublicationRow[]>,
  ]);

  const basic: TeamBasicState = {
    categoryId: row.categoryId,
    name: row.name,
    position: row.position,
    rank: row.rank ?? 0,
    isFeatured: !!row.isFeatured,
    isActive: !!row.isActive,
    image: row.image as UploadedImageJson,
  };

  const profile: TeamProfileState = {
    bio: row.bio ?? '',
    education: null,
    experience: row.experience ?? null,
    achievements: row.achievements ?? null,
    publications: row.publications ?? null,
    metadata: row.metadata ?? null,
  };

  const contact: TeamContactState = {
    email: row.email ?? null,
    phone: row.phone ?? null,
    expertiseArea: row.expertiseArea ?? null,
    officeLocation: row.officeLocation ?? null,
    workingHours: parseWorkingHours(row.workingHours),
    assistantContact: row.assistantContact ?? null,
    showEmail: !!row.showEmail,
    showPhone: !!row.showPhone,
    showSocialLinks: !!row.showSocialLinks,
    allowContact: !!row.allowContact,
  };

  const lists: TeamListsState = {
    languages: row.languages ?? [],
    boardCommittees: row.boardCommittees ?? [],
    professionalAffiliations: row.professionalAffiliations ?? [],
    awards: row.awards ?? [],
  };

  const social: TeamSocialState = {
    socialLinks: (row.socialLinks as SocialLink[] | null) ?? null,
  };

  return {
    id: row.id,

    slug: row.slug,
    category: { id: row.category.id, name: row.category.name },
    basic,
    profile,
    contact,
    lists,
    social,
    metadata: row.metadata as TeamMetadata | null,

    // NEW RELATIONAL SECTIONS
    educations,
    experiences,
    achievements,
    publications,
  };
}
