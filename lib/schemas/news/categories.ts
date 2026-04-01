import { z } from 'zod';

export const newsCategorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2).max(160),
  description: z.string().max(600).optional().nullable(),
  is_active: z.boolean().optional(),
});

export type NewsCategoryFormValues = z.infer<typeof newsCategorySchema>;
