// types/cloudinary.ts
import { z } from 'zod';
import { IMAGE_SIZES, type ImageSizeKey } from '@/lib/image-size';

export interface CloudinaryImage {
  public_id: string;
  url: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  created_at?: string;
  tags?: string[];
  blurDataURL?: string;
}

export interface UploadedImageResponse {
  main: CloudinaryImage;
  variants: Record<ImageSizeKey, CloudinaryImage>;
}

// 1) exact key enum from your IMAGE_SIZES
const IMAGE_SIZE_KEYS = Object.keys(IMAGE_SIZES) as ImageSizeKey[];
const ImageSizeKeyEnum = z.enum(IMAGE_SIZE_KEYS as [ImageSizeKey, ...ImageSizeKey[]]);

// 2) value schema
export const cloudinaryImageSchema = z.object({
  public_id: z.string(),
  url: z.string().url(),
  secure_url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  created_at: z.string().optional(),
  tags: z.array(z.string()).optional(),
  blurDataURL: z.string().optional(),
});

// 3) full response schema — pass BOTH args to z.record to satisfy TS
export const uploadedImageResponseSchema = z.object({
  main: cloudinaryImageSchema,
  variants: z.record(ImageSizeKeyEnum, cloudinaryImageSchema),
});

// (optional) derive types from zod instead of manual interfaces
export type ZUploadedImageResponse = z.infer<typeof uploadedImageResponseSchema>;
export type ZCloudinaryImage = z.infer<typeof cloudinaryImageSchema>;
