import { z } from 'zod';
import { uploadedImageResponseSchema } from '@/lib/schemas/shared/image';

export const coreValueItemSchema = z.object({
  id: z.string().min(1), // can be "temp-..." for new rows
  title: z.string().min(2).max(160),
  description: z.string().min(2),
  icon: z.string().max(120).optional().nullable(),
  rank: z.number().int().positive(),
});

export const orgCoreValuesSaveSchema = z.object({
  // JSON string already parsed by executeAction (we’ll register as jsonField)
  coreValues: z.array(coreValueItemSchema),

  // Organization fields
  coreValuesLeadText: z.string().optional().nullable(),

  // Image is optional; store as JSON in Organization.coreValuesImage
  coreValuesImage: uploadedImageResponseSchema.optional().nullable(),
});

export type OrgCoreValuesSaveInput = z.infer<typeof orgCoreValuesSaveSchema>;
