import type { LeadershipCategoryType } from '@/generated/prisma/client';
import type { SocialLink } from '@/lib/schemas/shared/social';
import { ensureUploadedImageStrict } from '@/lib/assets/core';

export type TeamMemberPreview = {
  id: string;
  slug: string;
  name: string;
  position: string;
  bio: string;
  // use the actual return type of the strict helper
  image: ReturnType<typeof ensureUploadedImageStrict>;
  socialLinks: SocialLink[];
  isFeatured: boolean;
};

export type CategoryWithActiveMembers = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  rank: number;
  categoryType: LeadershipCategoryType;
  teamMembers: TeamMemberPreview[];
};
