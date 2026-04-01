// lib/about/leadership/visibility.ts

import type { ActiveTeamMemberWithRelated } from '@/lib/data/public/about/getters';

export type LeadershipMember = ActiveTeamMemberWithRelated['member'];
export type LeadershipMessage = ActiveTeamMemberWithRelated['message'];

export type VisibilityFlags = {
  showBio?: boolean;
  showWorkingHours?: boolean;
  showEducation?: boolean;
  showExperience?: boolean;
  showAchievements?: boolean;
  showPublications?: boolean;
  showLists?: boolean;
};

type EducationItems = NonNullable<LeadershipMember['educationItems']>;
type ExperienceItems = NonNullable<LeadershipMember['experienceItems']>;
type AchievementItems = NonNullable<LeadershipMember['achievementItems']>;
type PublicationItems = NonNullable<LeadershipMember['publicationItems']>;

type Languages = NonNullable<LeadershipMember['languages']>;
type BoardCommittees = NonNullable<LeadershipMember['boardCommittees']>;
type ProfessionalAffiliations = NonNullable<LeadershipMember['professionalAffiliations']>;
type Awards = NonNullable<LeadershipMember['awards']>;

export type LeadershipVisibility = {
  // raw visibility toggles
  showBio: boolean;
  showWorkingHours: boolean;
  showEducation: boolean;
  showExperience: boolean;
  showAchievements: boolean;
  showPublications: boolean;
  showLists: boolean;

  // relational collections (always arrays, never null/undefined)
  educationItems: EducationItems;
  experienceItems: ExperienceItems;
  achievementItems: AchievementItems;
  publicationItems: PublicationItems;

  languages: Languages;
  boardCommittees: BoardCommittees;
  professionalAffiliations: ProfessionalAffiliations;
  awards: Awards;

  // derived booleans
  hasEducation: boolean;
  hasExperience: boolean;
  hasAchievements: boolean;
  hasExtendedInfo: boolean;

  hasPublications: boolean;
  hasLists: boolean;
  hasOfficeInfo: boolean;

  hasOverview: boolean;
  hasCareer: boolean;
  hasBackground: boolean;
  canContact: boolean;

  showDirectContact: boolean;
};

export function computeLeadershipVisibility(
  member: LeadershipMember,
  message: LeadershipMessage | null,
): LeadershipVisibility {
  const meta = (member.metadata ?? {}) as { visibilityFlags?: VisibilityFlags };
  const visibility = meta.visibilityFlags ?? {};

  const showBio = visibility.showBio ?? true;
  const showWorkingHours = visibility.showWorkingHours ?? true;
  const showEducation = visibility.showEducation ?? true;
  const showExperience = visibility.showExperience ?? true;
  const showAchievements = visibility.showAchievements ?? true;
  const showPublications = visibility.showPublications ?? true;
  const showLists = visibility.showLists ?? true;

  const educationItems: EducationItems = (member.educationItems ?? []) as EducationItems;
  const experienceItems: ExperienceItems = (member.experienceItems ?? []) as ExperienceItems;
  const achievementItems: AchievementItems = (member.achievementItems ?? []) as AchievementItems;
  const publicationItems: PublicationItems = (member.publicationItems ?? []) as PublicationItems;

  const languages: Languages = (member.languages ?? []) as Languages;
  const boardCommittees: BoardCommittees = (member.boardCommittees ?? []) as BoardCommittees;
  const professionalAffiliations: ProfessionalAffiliations = (member.professionalAffiliations ??
    []) as ProfessionalAffiliations;
  const awards: Awards = (member.awards ?? []) as Awards;

  const hasEducation = showEducation && educationItems.length > 0;
  const hasExperience = showExperience && experienceItems.length > 0;
  const hasAchievements = showAchievements && achievementItems.length > 0;
  const hasExtendedInfo = hasEducation || hasExperience || hasAchievements;

  const hasPublications = showPublications && publicationItems.length > 0;

  const hasLists =
    showLists &&
    (languages.length > 0 ||
      boardCommittees.length > 0 ||
      professionalAffiliations.length > 0 ||
      awards.length > 0);

  const hasOfficeInfo =
    Boolean(member.officeLocation) ||
    (showWorkingHours && Boolean(member.officeHours)) ||
    Boolean(member.assistantContact);

  const hasOverview = Boolean(message) || (showBio && Boolean(member.bio));
  const hasCareer = hasExtendedInfo;
  const hasBackground = hasOfficeInfo || hasLists;

  const canContact =
    member.allowContact ||
    (member.showEmail && !!member.email) ||
    (member.showPhone && !!member.phone);

  const showDirectContact =
    (member.showEmail && !!member.email) || (member.showPhone && !!member.phone);

  return {
    showBio,
    showWorkingHours,
    showEducation,
    showExperience,
    showAchievements,
    showPublications,
    showLists,

    educationItems,
    experienceItems,
    achievementItems,
    publicationItems,

    languages,
    boardCommittees,
    professionalAffiliations,
    awards,

    hasEducation,
    hasExperience,
    hasAchievements,
    hasExtendedInfo,

    hasPublications,
    hasLists,
    hasOfficeInfo,

    hasOverview,
    hasCareer,
    hasBackground,
    canContact,

    showDirectContact,
  };
}
