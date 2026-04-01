import { z } from 'zod';
import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const orgAwardSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(160),
  issuer: z.string().max(160).optional().nullable(),
  date: z.date().optional().nullable(),
  summary: z.string().max(600).optional().nullable(),
  rank: z.number().int().positive().optional(),

  // Image OR PDF, single or array, or null, handled by FileDropzone
  badge: assetJsonSchema.optional(),
});

export type OrgAwardFormValues = z.infer<typeof orgAwardSchema>;
