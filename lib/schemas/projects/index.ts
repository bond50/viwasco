import { z } from 'zod';
import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const projectSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).optional().nullable(),
  categoryId: z.string().min(1, 'Select a project category.'),
  status: z.enum(['ONGOING', 'COMPLETED']),
  short_description: z.string().min(10).max(220),
  content: z.string().min(10),
  hero_image: assetJsonSchema.optional(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
