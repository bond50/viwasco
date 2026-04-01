import 'server-only';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryImage, UploadedImageResponse } from '@/lib/types/cloudinary';
import { IMAGE_SIZES, ImageSizeKey } from '@/lib/image-size';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Keys that should enforce a specific aspect-ratio crop/fill */
const FILL_KEYS = new Set([
  'banner',
  'hero',
  'cover',
  'wide',
  'poster',
  'landscape',
  'card',
  'avatar',
  'square',
]);

export const uploadImage = async (
  file: File,
  folder: string = 'sloya',
): Promise<UploadedImageResponse> => {
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload original
  const mainUploaded = await cloudinary.uploader.upload(
    `data:${file.type};base64,${buffer.toString('base64')}`,
    {
      folder,
      resource_type: 'image',
      format: 'webp',
      transformation: [{ width: 2000, crop: 'limit' }],
    },
  );

  // blur placeholder
  const blurBuffer = await sharp(buffer).resize(10).webp({ quality: 40 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;
  // Build transformation URLs for each key in IMAGE_SIZES
  const variants = (Object.keys(IMAGE_SIZES) as ImageSizeKey[]).reduce(
    (acc, key) => {
      const { width, height } = IMAGE_SIZES[key];

      const hasW = !!width;
      const hasH = !!height;
      const shouldFillCrop = hasW && hasH && FILL_KEYS.has(key);

      const url = cloudinary.url(mainUploaded.public_id, {
        width: hasW ? width! : undefined,
        height: hasH ? height! : undefined,
        crop: shouldFillCrop ? 'fill' : hasW ? 'limit' : undefined,
        gravity: shouldFillCrop ? 'auto:faces' : undefined, // faces only when we crop
        quality: 'auto',
        format: 'webp',
        secure: true,
      });

      acc[key] = {
        public_id: mainUploaded.public_id,
        url,
        secure_url: url,
        width: width ?? undefined,
        height: height ?? undefined,
        format: 'webp',
        blurDataURL,
      } as CloudinaryImage;

      return acc;
    },
    {} as Record<ImageSizeKey, CloudinaryImage>,
  );
  return {
    main: {
      public_id: mainUploaded.public_id,
      url: mainUploaded.secure_url,
      secure_url: mainUploaded.secure_url,
      width: mainUploaded.width,
      height: mainUploaded.height,
      format: mainUploaded.format,
      bytes: mainUploaded.bytes,
      created_at: mainUploaded.created_at,
      blurDataURL,
    },
    variants,
  };
};

/**
 * Deletes an image from Cloudinary.
 * Since we only store one physical image, we only need to delete one public_id.
 *
 * @param publicId - The public_id of the image to delete.
 */
export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Error deleting image from Cloudinary:', err);
  }
};

export const uploadRawFile = async (file: File, folder: string = 'jitmat') => {
  const fileBuffer = await file.arrayBuffer();

  const mimetype = file.type;
  const filename = file.name;
  const encoding = 'base64';
  const dataOfBase64 = Buffer.from(fileBuffer).toString('base64');

  const pdfUrl = 'data:' + mimetype + ';' + encoding + ',' + dataOfBase64;

  const res = await cloudinary.uploader.upload(pdfUrl, {
    resource_type: 'raw',
    filename_override: filename,
    folder: folder,
  });

  return {
    public_id: res.public_id,
    url: res.url,
    secure_url: res.secure_url,
    bytes: res.bytes,
    format: res.format,
    resource_type: res.resource_type,
    mimeType: file.type,
    original_filename: res.original_filename,
  };
};

export const deleteRawFile = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};
