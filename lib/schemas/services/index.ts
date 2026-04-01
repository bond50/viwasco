import { z } from 'zod';
import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const serviceSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).optional().nullable(),
  excerpt: z.string().max(600).optional().nullable(),

  // Stored in DB JSON as { html: string }
  content: z.string().min(10, 'Content is required'),

  image: assetJsonSchema.optional(),

  is_active: z.boolean().optional(),
  is_public: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
