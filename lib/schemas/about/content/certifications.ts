import { z } from 'zod';
import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const orgCertificationSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2).max(160),
  issuingAuthority: z.string().max(160).optional().nullable(),
  issueDate: z.date().optional().nullable(),
  expiryDate: z.date().optional().nullable(),
  rank: z.number().int().positive().optional(),

  // File (usually PDF, but we allow image too if needed)
  certificateFile: assetJsonSchema.optional(),
});

export type OrgCertificationFormValues = z.infer<typeof orgCertificationSchema>;
