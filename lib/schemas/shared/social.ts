// lib/schemas/shared/social.ts
import { z } from 'zod';

export const socialPlatforms = [
  'facebook',
  'x',
  'instagram',
  'tiktok',
  'linkedin',
  'threads',
] as const;

export type Platform = (typeof socialPlatforms)[number];

// Build the URL schema using top-level z.url() to avoid deprecated String#url()
const canonicalUrlSchema = z
  .string()
  .transform((u) => (u.startsWith('http') ? u : `https://${u}`))
  .pipe(z.url({ message: 'Must be a valid URL' }));

export const socialLinkSchema = z
  .object({
    platform: z.enum(socialPlatforms),
    url: canonicalUrlSchema,
  })
  .superRefine((data, ctx) => {
    const expectedHost = data.platform === 'x' ? 'x.com' : data.platform;
    try {
      const hostname = new URL(data.url).hostname;
      if (!hostname.includes(expectedHost)) {
        ctx.addIssue({
          code: 'custom',
          path: ['url'],
          message: `URL must be a valid ${data.platform} link`,
        });
      }
    } catch {
      // Already validated by z.url()
    }
  });

export const socialLinksSchema = z.array(socialLinkSchema).optional();

export type SocialLink = z.infer<typeof socialLinkSchema>;
