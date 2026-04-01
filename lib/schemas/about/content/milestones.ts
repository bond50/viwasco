import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';
import { uploadedFileResponseSchema } from '@/lib/schemas/shared/file';

export const orgMilestoneSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(200),
  summary: z.string().max(1000).optional().nullable(),
  year: z.number().int().positive().max(9999).optional().nullable(),
  date: z.date().optional().nullable(),
  rank: z.number().int().positive().optional(),
  image: z
    .union([uploadedImageResponseSchema, uploadedFileResponseSchema, z.string()])
    .optional()
    .nullable(),
});
