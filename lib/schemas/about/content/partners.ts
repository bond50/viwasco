// lib/schemas/about/content/partners.ts
import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import { enumSelect } from '@/lib/schemas/utils/form'; // ← ADD THIS

export const partnershipTypes = [
  'GOVERNMENT',
  'REGULATOR',
  'DONOR',
  'SUPPLIER',
  'NGO',
  'COMMUNITY',
  'OTHER',
] as const;

export type PartnershipType = (typeof partnershipTypes)[number];

const websiteSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? (v.startsWith('http') ? v : `https://${v}`) : undefined));

export const partnerSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2).max(160),
  slug: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  website: websiteSchema,

  partnershipType: enumSelect(partnershipTypes),

  logo: uploadedImageResponseSchema.optional().nullable(),
  rank: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;
