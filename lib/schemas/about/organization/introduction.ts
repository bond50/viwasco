import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';

export const organisationIntroductionSchema = z.object({
  introTitle: z.string().max(160).optional().nullable(),
  introDescription: z.string().max(2000).optional().nullable(),
  bannerImage: uploadedImageResponseSchema.optional().nullable(),
  introImage: uploadedImageResponseSchema.optional().nullable(),
});

export type OrganisationIntroductionValues = z.infer<typeof organisationIntroductionSchema>;
