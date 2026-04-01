'use server';

import { deleteImage, uploadImage } from '@/lib/cloudinary';
import { UploadedImageResponse } from '@/lib/types/cloudinary';

/**
 * Server action to handle image uploads from the client.
 */
export const uploadImageAction = async (formData: FormData): Promise<UploadedImageResponse> => {
  const file = formData.get('file') as File | null;
  const folder = formData.get('folder') as string | null;

  if (!file) {
    throw new Error('No file provided.');
  }

  const finalFolder = folder ?? 'jitmat';
  return await uploadImage(file, finalFolder);
};

/**
 * Server action to handle image deletions.
 */
export const deleteImageAction = async (publicId: string): Promise<void> => {
  if (!publicId) {
    throw new Error('Missing public_id for deletion.');
  }
  await deleteImage(publicId);
};
