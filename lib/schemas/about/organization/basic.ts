import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';

export const organisationBasicSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  logo: uploadedImageResponseSchema.optional().nullable(),
  featuredImage: uploadedImageResponseSchema.optional().nullable(),
});

export type OrganisationBasicValues = z.infer<typeof organisationBasicSchema>;
