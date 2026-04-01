// lib/schemas/shared/file.ts
import { z } from 'zod';

export const uploadedFileResponseSchema = z.object({
  public_id: z.string(),
  url: z.string().url(),
  secure_url: z.string().url(),
  bytes: z.number().optional(),
  format: z.string().optional(),
  resource_type: z.string().optional(),
  mimeType: z.string().optional(),
  original_filename: z.string().optional(),
});

export type UploadedFileResponse = z.infer<typeof uploadedFileResponseSchema>;
