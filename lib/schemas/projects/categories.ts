import { z } from 'zod';

export const projectCategorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2).max(160),
  description: z.string().max(600).optional().nullable(),
  is_active: z.boolean().optional(),
});

export type ProjectCategoryFormValues = z.infer<typeof projectCategorySchema>;
