import { z } from 'zod';

import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const newsSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220).optional().nullable(),
  category: z.string().min(2).max(160),
  excerpt: z.string().min(10).max(600),
  content: z.string().min(10),
  hero_image: assetJsonSchema.optional(),
  published_at: z.date().optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type NewsFormValues = z.infer<typeof newsSchema>;
