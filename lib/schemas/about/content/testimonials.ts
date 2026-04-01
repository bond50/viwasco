import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';

export const orgTestimonialSchema = z.object({
  id: z.string().optional().nullable(),
  authorName: z.string().min(2).max(120),
  authorRole: z.string().max(160).optional().nullable(),
  message: z.string().min(5).max(1000),
  published: z.boolean().optional(),
  rank: z.number().int().positive().optional(),
  avatar: uploadedImageResponseSchema.optional().nullable(),
});
