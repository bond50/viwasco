import { z } from 'zod';

import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const careerSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220).optional().nullable(),
  typeId: z.string().min(1),
  department: z.string().min(2).max(160),
  location: z.string().min(2).max(160),
  summary: z.string().max(1000).optional().nullable(),
  file: assetJsonSchema,
  closing_at: z.date().optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type CareerFormValues = z.infer<typeof careerSchema>;
