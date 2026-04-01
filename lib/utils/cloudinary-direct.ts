// lib/utils/cloudinary-direct.ts
'use client';

import type { CloudinaryImage, UploadedImageResponse } from '@/lib/types/cloudinary';
import { IMAGE_SIZES, type ImageSizeKey } from '@/lib/image-size';

/** Sizes that should be cropped/fill to a strict aspect-ratio */
const FILL_KEYS = new Set<ImageSizeKey>([
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

type DirectOpts = {
  cloudName: string; // e.g. process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  uploadPreset: string; // unsigned preset (or signed if you add a signer)
  folder?: string; // e.g. "project/uploads"
  /** Client-side downscale max width (0/undefined to skip) */
  maxWidth?: number; // default 2000
  /** Optional override target mime for downscale (omit to preserve ORIGINAL) */
  targetType?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** Quality used only when downscaling via canvas */
  targetQuality?: number; // default 0.85
};

/* ────────────────────────────────────────────────────────────────────────────
   Helpers: downscale (preserve original format unless targetType provided)
──────────────────────────────────────────────────────────────────────────── */

function extFromMime(m: string): string {
  if (m === 'image/jpeg') return 'jpg';
  if (m === 'image/png') return 'png';
  if (m === 'image/webp') return 'webp';
  const guess = m.split('/')[1];
  return guess || 'img';
}

/** Downscale in-browser for faster uploads; preserves original type by default */
export async function downscaleImageClient(
  file: File,
  maxW = 2000,
  targetType?: DirectOpts['targetType'],
  targetQuality = 0.85,
): Promise<File> {
  try {
    if (!file.type.startsWith('image/')) return file;

    const bitmap = await createImageBitmap(file);
    const scale = maxW && bitmap.width > maxW ? maxW / bitmap.width : 1;
    if (scale >= 1) return file; // already small enough

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const mime = targetType || file.type; // ← preserve original if not provided
    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), mime, targetQuality),
    );

    // Preserve the original extension unless targetType overrides it
    const origExt = (() => {
      const m = /\.([a-zA-Z0-9]+)$/.exec(file.name);
      return m?.[1]?.toLowerCase() || extFromMime(file.type);
    })();

    const outExt = targetType ? extFromMime(targetType) : origExt;
    const base = file.name.replace(/\.[a-zA-Z0-9]+$/, '');
    const newName = `${base}.${outExt}`;

    return new File([blob], newName, { type: mime });
  } catch {
    return file;
  }
}

/** Tiny blur placeholder from a File (client-side) */
async function makeBlurDataURLFromFile(file: File, width = 10, quality = 0.35): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = width / bitmap.width;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), 'image/jpeg', quality),
    );
    const buf = await blob.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    return `data:image/jpeg;base64,${b64}`;
  } catch {
    return '';
  }
}

/**
 * Insert a Cloudinary transformation into a secure_url WITHOUT changing file format.
 * (No extension swap — we keep whatever Cloudinary stored originally.)
 */
function buildTransformedUrl(secureUrl: string, transform: string): string {
  const idx = secureUrl.indexOf('/upload/');
  if (idx === -1) return secureUrl;

  const prefix = secureUrl.slice(0, idx + '/upload/'.length); // .../upload/
  const rest = secureUrl.slice(idx + '/upload/'.length); // v123/folder/file.jpg?...
  const qIdx = rest.indexOf('?');
  const hashIdx = rest.indexOf('#');
  const splitAt = [qIdx, hashIdx].filter((n) => n >= 0).sort((a, b) => a - b)[0] ?? -1;
  const path = splitAt >= 0 ? rest.slice(0, splitAt) : rest;
  const tail = splitAt >= 0 ? rest.slice(splitAt) : '';

  // Just prefix transformation; do not touch extension
  const transformedPath = `${transform}/${path}`;
  return `${prefix}${transformedPath}${tail}`;
}

/** Build size variants; keep original format for URLs and metadata */
function buildVariants(
  baseSecureUrl: string,
  publicId: string,
  blurDataURL: string,
  baseFormat?: string,
): Record<ImageSizeKey, CloudinaryImage> {
  const variants = {} as Record<ImageSizeKey, CloudinaryImage>;

  (Object.keys(IMAGE_SIZES) as ImageSizeKey[]).forEach((key) => {
    const def = IMAGE_SIZES[key];
    const hasW = def.width != null;
    const hasH = def.height != null;
    const fill = hasW && hasH && FILL_KEYS.has(key);

    const parts: string[] = [];
    if (hasW) parts.push(`w_${def.width}`);
    if (hasH) parts.push(`h_${def.height}`);
    if (fill) {
      parts.push('c_fill', 'g_auto');
    } else if (hasW) {
      parts.push('c_limit'); // keep aspect, bound by width only
    }
    parts.push('q_auto'); // quality auto; NO format transform

    const transform = parts.join(',');
    const url = buildTransformedUrl(baseSecureUrl, transform);

    variants[key] = {
      public_id: publicId,
      url,
      secure_url: url,
      width: def.width ?? undefined,
      height: def.height ?? undefined,
      format: baseFormat, // keep original format label for convenience
      blurDataURL,
    };
  });

  return variants;
}

/* ────────────────────────────────────────────────────────────────────────────
   Direct upload (with progress) — no forced WebP
──────────────────────────────────────────────────────────────────────────── */

type CloudinaryUploadJSON = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  format: string;
};

export async function uploadImageDirectWithVariants(
  file: File,
  opts: DirectOpts,
  onProgress?: (percent: number) => void,
): Promise<UploadedImageResponse> {
  const {
    cloudName,
    uploadPreset,
    folder = 'uploads',
    maxWidth = 2000,
    targetType, // optional — if omitted, we keep original
    targetQuality = 0.85,
  } = opts;

  if (!cloudName?.trim()) {
    throw new Error('Missing Cloudinary cloudName (check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME).');
  }
  if (!uploadPreset?.trim()) {
    throw new Error(
      'Missing Cloudinary uploadPreset (check NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).',
    );
  }

  // 1) Optional downscale; preserve original type unless targetType provided
  const toUpload = maxWidth
    ? await downscaleImageClient(file, maxWidth, targetType, targetQuality)
    : file;

  // 2) Blur placeholder
  const blurDataURL = await makeBlurDataURLFromFile(toUpload, 10, 0.35);

  // 3) Direct upload (XHR for progress)
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const form = new FormData();
  form.append('file', toUpload);
  form.append('upload_preset', uploadPreset);
  form.append('folder', folder);

  const json: CloudinaryUploadJSON = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      const contentType = xhr.getResponseHeader('content-type') || '';
      const reqId = xhr.getResponseHeader('x-cld-request-id') || '';
      const body = xhr.responseText || '';

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error('Upload succeeded but response could not be parsed.'));
        }
        return;
      }

      let message = `Upload failed (${xhr.status})`;
      if (contentType.includes('application/json')) {
        try {
          const parsed = JSON.parse(body);
          const m = parsed?.error?.message || parsed?.message;
          if (m) message = m;
        } catch {
          /* noop */
        }
      } else if (body) {
        message = body;
      }
      if (/cloud[_\s-]?name.*disabled/i.test(message)) {
        message += ' — Check Cloudinary account status and cloud name.';
      }
      if (reqId) message += ` [request ${reqId}]`;
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(form);
  });

  // 4) Variants that preserve original format (no f_webp)
  const variants = buildVariants(json.secure_url, json.public_id, blurDataURL, json.format);

  // 5) Return in your canonical shape
  return {
    main: {
      public_id: json.public_id,
      url: json.secure_url,
      secure_url: json.secure_url,
      width: json.width,
      height: json.height,
      format: json.format, // keep original format
      bytes: json.bytes,
      created_at: json.created_at,
      blurDataURL,
    },
    variants,
  };
}
