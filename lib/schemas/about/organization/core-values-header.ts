import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';

export const organisationCoreValuesHeaderSchema = z.object({
  coreValuesLeadText: z.string().max(1000).optional().nullable(),
  coreValuesImage: uploadedImageResponseSchema.optional().nullable(),
});

export type OrganisationCoreValuesHeaderValues = z.infer<typeof organisationCoreValuesHeaderSchema>;
