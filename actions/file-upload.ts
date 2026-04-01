'use server';

import { deleteRawFile, uploadRawFile } from '@/lib/cloudinary';
import type { UploadedFileResponse } from '@/lib/types/files';

export const uploadFileAction = async (formData: FormData): Promise<UploadedFileResponse> => {
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string | null) ?? 'viwasco';
  if (!file) throw new Error('No file provided.');
  return uploadRawFile(file, folder);
};

export const deleteFileAction = async (publicId: string) => {
  if (!publicId) throw new Error('Missing public_id');
  await deleteRawFile(publicId);
};
