import { z } from 'zod';
import { assetJsonSchema } from '@/lib/schemas/shared/asset';

export const orgDocumentSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  published: z.boolean().optional().default(true),

  // Required: OrganizationDocument.file is Json (not nullable in your model)
  file: assetJsonSchema,
});

export type OrgDocumentFormValues = z.infer<typeof orgDocumentSchema>;
