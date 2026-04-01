// lib/types/about/leadership.ts
import type { z } from 'zod';
import type { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import type { SocialLink } from '@/lib/schemas/shared/social';
import { TeamEducationLevel } from '@/lib/schemas/about/content/leadership';

export type UploadedImageJson = z.infer<typeof uploadedImageResponseSchema> | null | undefined;

export type TeamBasicState = {
  categoryId: string;
  name: string;
  position: string;
  rank: number;
  isFeatured: boolean;
  isActive: boolean;
  image?: UploadedImageJson;
};

export type TeamProfileState = {
  bio: string;
  education?: string | null;
  experience?: string | null;
  achievements?: string | null;
  publications?: unknown;
  metadata?: unknown;
};

export type TeamContactState = {
  email?: string | null;
  phone?: string | null;
  expertiseArea?: string | null;
  officeLocation?: string | null;
  workingHours?: Array<{ days: string; hours: string }> | null;
  assistantContact?: string | null;

  showEmail: boolean;
  showPhone: boolean;
  showSocialLinks: boolean;
  allowContact: boolean;
};

export type TeamListsState = {
  languages: string[];
  boardCommittees: string[];
  professionalAffiliations: string[];
  awards: string[];
};

export type TeamSocialState = {
  socialLinks?: SocialLink[] | null;
};
export type TeamMetadata = {
  visibilityFlags?: {
    showBio?: boolean;
    showWorkingHours?: boolean;
    showEducation?: boolean;
    showExperience?: boolean;
    showAchievements?: boolean;
    showPublications?: boolean;
    showLists?: boolean;
  };
  // Add other possible metadata properties here
};
export type TeamSettingsData = {
  id: string;
  slug: string;
  category: { id: string; name: string };
  basic: TeamBasicState;
  profile: TeamProfileState;
  contact: TeamContactState;
  lists: TeamListsState;
  social: TeamSocialState;
  metadata: TeamMetadata | null;

  // Relational arrays
  educations: AdminTeamEducationRow[];
  experiences: AdminTeamExperienceRow[];
  achievements: AdminTeamAchievementRow[];
  publications: AdminTeamPublicationRow[];
};

export type AdminTeamExperienceRow = {
  id: string;
  teamId: string;
  role: string;
  organization: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  achievements: string[];
  isCurrent: boolean;
  rank: number;
};

export type AdminTeamAchievementRow = {
  id: string;
  teamId: string;
  title: string;
  year: number | null;
  description: string | null;
  rank: number;
};

export type AdminTeamPublicationRow = {
  id: string;
  teamId: string;
  title: string;
  url: string | null;
  year: number | null;

  rank: number;
};

export type AdminTeamEducationRow = {
  id: string;
  teamId: string;
  institution: string;
  qualification: string | null;
  level: TeamEducationLevel | null;
  field: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  honor: string | null;
  logo: unknown | null;
  rank: number;
};
