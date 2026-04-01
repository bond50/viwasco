// lib/schemas/shared/asset.ts
import { z } from 'zod';
import { uploadedImageResponseSchema } from './image';
import { uploadedFileResponseSchema } from './file';

// A single image OR a single file
export const uploadedAssetSchema = z.union([
  uploadedImageResponseSchema,
  uploadedFileResponseSchema,
]);

// An array of assets (for allowMultiple=true scenarios)
export const uploadedAssetArraySchema = z.array(uploadedAssetSchema);

// JSON column shape: single asset OR array of assets OR null
export const assetJsonSchema = z.union([uploadedAssetSchema, uploadedAssetArraySchema]).nullable();

export type UploadedAsset = z.infer<typeof uploadedAssetSchema>;
export type UploadedAssetArray = z.infer<typeof uploadedAssetArraySchema>;
export type AssetJson = z.infer<typeof assetJsonSchema>; // UploadedAsset | UploadedAsset[] | null
