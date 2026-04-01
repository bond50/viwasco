import { z } from 'zod';

import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const newsletterSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220).optional().nullable(),
  categoryId: z.string().min(1),
  excerpt: z.string().min(10).max(600),
  content: z.string().min(10),
  file: assetJsonSchema,
  hero_image: assetJsonSchema.optional(),
  published_at: z.date().optional().nullable(),
  downloads: z.number().int().nonnegative().optional(),
  size_mb: z.number().nonnegative().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
