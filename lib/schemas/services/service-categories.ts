import { z } from 'zod';

export const serviceCategorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(180).optional().nullable(),
  description: z.string().max(600).optional().nullable(),
  icon: z.string().max(120).optional().nullable(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type ServiceCategoryFormValues = z.infer<typeof serviceCategorySchema>;
