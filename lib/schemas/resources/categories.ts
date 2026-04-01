import { z } from 'zod';

export const resourceCategorySchema = z.object({
  id: z.string().optional().nullable(),
  kindId: z.string().min(1),
  name: z.string().min(2).max(160),
  description: z.string().max(600).optional().nullable(),
  is_active: z.boolean().optional(),
});

export type ResourceCategoryFormValues = z.infer<typeof resourceCategorySchema>;
