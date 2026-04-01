import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import { socialLinksSchema } from '@/lib/schemas/shared/social';
import { optionalEmailSchema } from '@/lib/schemas/auth';
import { workingHoursSchema } from '@/lib/schemas/shared/working-hours';
import { EducationLevel } from '@/generated/prisma/client';
import { enumSelectBase } from '@/lib/schemas/utils/form';

/**
 * === Categories ===
 */
export const managementCategorySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional().nullable(),
  categoryType: z.enum(['BOARD', 'EXECUTIVE', 'MANAGEMENT']).default('MANAGEMENT'),
  rank: z.number().int().positive().optional(),
});

export type ManagementCategoryFormValues = z.infer<typeof managementCategorySchema>;

/**
 * === Team: create ===
 * Used only when creating a new team member.
 * Minimal but enough to render a public profile.
 */
export const managementTeamCreateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2).max(160),
  position: z.string().min(2).max(160),
  bio: z.string().min(2).optional(),
  image: uploadedImageResponseSchema,
  rank: z.number().int().positive().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  socialLinks: z.preprocess((v) => (v == null || v === '' ? [] : v), socialLinksSchema.optional()),
});

export type ManagementTeamCreateValues = z.infer<typeof managementTeamCreateSchema>;

/**
 * === Team: basic tab ===
 * Category, identity, status, rank, and photo.
 */
export const managementTeamBasicSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2).max(160),
  position: z.string().min(2).max(160),
  rank: z.number().int().positive().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  image: uploadedImageResponseSchema.optional().nullable(),
});

export type ManagementTeamBasicValues = z.infer<typeof managementTeamBasicSchema>;

/**
 * === Team: profile tab ===
 * Rich biography + extended text sections.
 */
export const managementTeamProfileSchema = z.object({
  bio: z.string().min(2),
  education: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  achievements: z.string().optional().nullable(),
  // keep publications flexible (JSON bag) – no `any`
  publications: z.unknown().optional().nullable(),
  metadata: z.unknown().optional().nullable(),
});

export type ManagementTeamProfileValues = z.infer<typeof managementTeamProfileSchema>;

/**
 * === Team: contact & office tab ===
 */
export const managementTeamContactSchema = z
  .object({
    email: optionalEmailSchema,
    phone: z.string().max(60).optional().nullable(),
    expertiseArea: z.string().max(200).optional().nullable(),
    officeLocation: z.string().max(240).optional().nullable(),
    workingHours: workingHoursSchema.optional().nullable(),
    assistantContact: z.string().max(240).optional().nullable(),

    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    showSocialLinks: z.boolean().optional(),
    allowContact: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.allowContact && !data.email) {
      ctx.addIssue({
        code: 'custom',
        path: ['allowContact'],
        message: 'Provide an email address to enable the contact form.',
      });
    }
  });

export type ManagementTeamContactValues = z.infer<typeof managementTeamContactSchema>;

/**
 * === Team: lists tab ===
 * Languages, committees, affiliations, awards.
 */
const stringList = z.preprocess(
  (val) => {
    if (val == null) return undefined;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val];
    return val;
  },
  z.array(z.string().min(1).max(200)),
);

export const managementTeamListsSchema = z.object({
  languages: stringList.optional().nullable(),
  boardCommittees: stringList.optional().nullable(),
  professionalAffiliations: stringList.optional().nullable(),
  awards: stringList.optional().nullable(),
});

export type ManagementTeamListsValues = z.infer<typeof managementTeamListsSchema>;

/**
 * === Team: social links tab ===
 * Same base shape as organization social links.
 */
export const managementTeamSocialSchema = z.object({
  socialLinks: z.preprocess(
    (v) => (v == null || v === '' ? [] : v),
    socialLinksSchema.optional().nullable(),
  ),
});

export type ManagementTeamSocialValues = z.infer<typeof managementTeamSocialSchema>;

/**
 * Optional: keep the old all-in-one schema for any legacy usages.
 * (You can delete this later if you confirm nothing imports it.)
 */
export const managementTeamSchema = z.object({
  id: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  name: z.string().min(2).max(160),
  position: z.string().min(2).max(160),
  bio: z.string().min(2),
  image: uploadedImageResponseSchema,
  rank: z.number().int().positive().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  socialLinks: z.preprocess((v) => (v == null || v === '' ? [] : v), socialLinksSchema.optional()),
});

export type ManagementTeamFormValues = z.infer<typeof managementTeamSchema>;
export const teamBioSchema = z.object({
  bio: z.string().min(2, 'Bio is required'),
});

export type TeamBioFormValues = z.infer<typeof teamBioSchema>;

const isoDateLike = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length ? v : undefined));

export const teamEducationLevelValues = [
  'PRIMARY',
  'SECONDARY',
  'CERTIFICATE',
  'DIPLOMA',
  'BACHELORS',
  'MASTERS',
  'DOCTORATE',
  'OTHER',
] as const;

// Prisma still the source of truth for the real enum
export type TeamEducationLevel = EducationLevel;

export const teamEducationSchema = z.object({
  id: z.string().optional(),
  teamId: z.string().min(1),
  institution: z.string().min(2, 'Institution is required'),
  qualification: z.string().max(160).optional().nullable(),

  // 🔧 Reuse enumSelectBase for normalization
  level: enumSelectBase().transform((val) => {
    if (!val) return null; // allow "no level" → null

    // val is already UPPERCASED string from enumSelectBase,
    // which matches your DB enum values, so just cast
    return val as TeamEducationLevel;
  }),

  field: z.string().max(160).optional().nullable(),
  startDate: isoDateLike,
  endDate: isoDateLike,
  isCurrent: z.boolean().default(false),
  description: z.string().max(1000).optional().nullable(),
  logo: z.unknown().optional(),
  honor: z.string().max(160).optional().nullable(),
});

export type TeamEducationFormValues = z.infer<typeof teamEducationSchema>;
export const teamExperienceSchema = z.object({
  id: z.string().optional(),
  teamId: z.string().min(1),

  role: z.string().min(2),
  organization: z.string().min(2),

  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),

  description: z.string().optional().nullable(),
  achievements: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return [] as string[];
      if (Array.isArray(val)) {
        return val.map((x) => x.trim()).filter(Boolean);
      }
      // val is a string like "a, b, c"
      return val
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
    }),

  isCurrent: z.boolean().default(false),
  rank: z.number().optional(),
});

export type TeamExperienceFormValues = z.infer<typeof teamExperienceSchema>;

export const teamAchievementSchema = z.object({
  id: z.string().optional(),
  teamId: z.string().min(1),

  title: z.string().min(2),
  issuer: z.string().max(200).optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  description: z.string().optional().nullable(),
  logo: uploadedImageResponseSchema.optional().nullable(),

  rank: z.number().optional(),
});

export type TeamAchievementFormValues = z.infer<typeof teamAchievementSchema>;

export const teamPublicationSchema = z.object({
  id: z.string().optional(),
  teamId: z.string().min(1),

  title: z.string().min(2),
  url: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  year: z.number().int().min(1900).max(2100).optional().nullable(),

  metadata: z.record(z.string(), z.unknown()).optional().nullable(),

  rank: z.number().optional(),
});

export type TeamPublicationFormValues = z.infer<typeof teamPublicationSchema>;

export const managementTeamFlagsSchema = z.object({
  // Core status
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),

  // Contact visibility
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showSocialLinks: z.boolean().optional(),
  allowContact: z.boolean().optional(),

  // Profile sections visibility (stored in metadata.visibilityFlags)
  showBio: z.boolean().optional(),
  showWorkingHours: z.boolean().optional(),
  showEducation: z.boolean().optional(),
  showExperience: z.boolean().optional(),
  showAchievements: z.boolean().optional(),
  showPublications: z.boolean().optional(),
  showLists: z.boolean().optional(),
});

export type ManagementTeamFlagsValues = z.infer<typeof managementTeamFlagsSchema>;
