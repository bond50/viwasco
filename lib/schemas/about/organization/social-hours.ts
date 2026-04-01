// lib/schemas/about/organization/social-hours.ts
import { z } from 'zod';
import { isValidUrl } from '@/lib/utils';
import { socialPlatforms } from '@/lib/schemas/shared/social';

// --- Legacy shape (current backend expectation) ---
const socialLinkLegacySchema = z.object({
  name: z.string().min(1).max(40),
  url: z.string().refine((v) => isValidUrl(v), { message: 'Invalid URL' }),
  icon: z.string().optional().nullable(),
});

// --- Canonical shape (what the UI is sending: { platform, url }) ---
const socialLinkCanonicalSchema = z.object({
  platform: z.enum(socialPlatforms),
  url: z.string().refine((v) => isValidUrl(v), { message: 'Invalid URL' }),
});

// Accept either legacy or canonical for each item, then normalize to legacy
const socialLinkUnion = z.union([socialLinkLegacySchema, socialLinkCanonicalSchema]);

const workingHourSchema = z.object({
  days: z.string().min(1).max(60),
  hours: z.string().min(1).max(60),
});

export const organisationSocialHoursSchema = z
  .object({
    socialLinks: z.array(socialLinkUnion).optional().nullable(),
    workingHours: z.array(workingHourSchema).optional().nullable(),
  })
  .transform((data) => {
    const normalized =
      data.socialLinks?.map((item) =>
        'platform' in item
          ? { name: item.platform, url: item.url, icon: null } // ← normalize to legacy
          : item,
      ) ?? null;

    return { ...data, socialLinks: normalized };
  });

export type OrganisationSocialHoursValues = z.infer<typeof organisationSocialHoursSchema>;
