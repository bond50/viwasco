// lib/schemas/shared/image.ts
import { z } from 'zod';
import { imageSizeKeySchema } from '@/lib/image-size';

export type ImageSizeKey = z.infer<typeof imageSizeKeySchema>;

export const cloudinaryImageSchema = z.object({
  public_id: z.string(),
  url: z.url(),
  secure_url: z.url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  created_at: z.string().optional(),
  blurDataURL: z.string().optional(),
});

export const uploadedImageResponseSchema = z.object({
  main: cloudinaryImageSchema,
  // NOTE: lenient string-keyed record so {} is a valid default
  variants: z.record(z.string(), cloudinaryImageSchema).optional().default({}),
});

export type CloudinaryImage = z.infer<typeof cloudinaryImageSchema>;
export type UploadedImageResponse = z.infer<typeof uploadedImageResponseSchema>;
