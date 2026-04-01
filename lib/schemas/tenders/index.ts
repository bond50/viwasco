import { z } from 'zod';

import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const tenderSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220).optional().nullable(),
  status: z.enum(['OPEN', 'AWARDED', 'ARCHIVED']),
  summary: z.string().min(10).max(2000),
  file: assetJsonSchema,
  published_at: z.date().optional().nullable(),
  closing_at: z.date().optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().nonnegative().optional(),
});

export type TenderFormValues = z.infer<typeof tenderSchema>;
