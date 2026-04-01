import { z } from 'zod';

export const orgDocumentCategorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2).max(160),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  rank: z.number().int().positive().optional(),
});

export type OrgDocumentCategoryFormValues = z.infer<typeof orgDocumentCategorySchema>;
