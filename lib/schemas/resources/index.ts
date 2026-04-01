import { z } from 'zod';

import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const resourceSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220).optional().nullable(),
  kindId: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  summary: z.string().min(10).max(1000),
  file: assetJsonSchema,
  is_active: z.boolean().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
