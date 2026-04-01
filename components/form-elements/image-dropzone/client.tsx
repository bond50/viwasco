// components/form-elements/image-dropzone/client.tsx
'use client';

import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { type Accept, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { FiExternalLink, FiFileText, FiTrash2, FiUpload } from 'react-icons/fi';

import { cn } from '@/lib/utils';
import { deleteImageAction } from '@/actions/image-upload';
import { deleteFileAction, uploadFileAction } from '@/actions/file-upload';
import { Progress } from '@/components/ui/progress';
import styles from './image-dropzone.module.css';

import { uploadImageDirectWithVariants } from '@/lib/utils/cloudinary-direct';
import type { UploadedImageResponse } from '@/lib/schemas/shared/image';
import type { UploadedFileResponse } from '@/lib/schemas/shared/file';
import { ensureUploadedAsset, isFileAsset, isImageAsset } from '@/lib/assets/core';

import type { ImageDropzoneProps } from './types';

type SingleUpload = UploadedImageResponse | UploadedFileResponse;
type UploadState = SingleUpload | SingleUpload[] | null;

function looksLikePdfUrl(url?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.endsWith('.pdf') || u.includes('mime=application/pdf');
}

/** Some older rows saved PDFs in the "image" shape. Detect those. */
function imageResponseIsRawPdf(v: UploadedImageResponse): boolean {
  const url = (v.main?.secure_url || v.main?.url || '').toLowerCase();
  return url.includes('/raw/upload') || looksLikePdfUrl(url);
}

function isPdfUploaded(f: UploadedFileResponse): boolean {
  const fmt = typeof f.format === 'string' ? f.format.toLowerCase() : undefined;
  return fmt === 'pdf' || looksLikePdfUrl(f.secure_url);
}

function fileNameFromUrl(url?: string, fallback?: string) {
  if (!url) return fallback;
  try {
    const { pathname } = new URL(url);
    const last = pathname.split('/').pop();
    return last || fallback;
  } catch {
    return fallback;
  }
}

export const FileDropzone: React.FC<ImageDropzoneProps> = ({
  name,
  label = 'Upload file',
  error,
  folder,
  maxSize = 30,
  defaultValue = null,
  className,
  mode = 'image',
  allowMultiple = false,
  onUploadingChange,
  onProgressChange,
}) => {
  const [isPending, startTransition] = useTransition();

  // Normalize incoming defaultValue (single or array) via shared helpers
  const normalizedDefault = useMemo<UploadState>(() => {
    const asset = ensureUploadedAsset(defaultValue ?? null);
    if (!asset) return null;
    if (Array.isArray(asset)) return asset as SingleUpload[];
    return asset as SingleUpload;
  }, [defaultValue]);

  // Internal state mirrors single / array
  const [uploaded, setUploaded] = useState<UploadState>(normalizedDefault);

  // Preview for single-item mode based on normalized default
  const initialPreview: string | null = useMemo(() => {
    if (!normalizedDefault || Array.isArray(normalizedDefault)) return null;

    const asset = normalizedDefault;
    if (isImageAsset(asset) && !imageResponseIsRawPdf(asset)) {
      return asset.main.secure_url ?? null;
    }
    if (isFileAsset(asset) && isPdfUploaded(asset)) {
      return asset.secure_url ?? null;
    }
    return null;
  }, [normalizedDefault]);

  const [preview, setPreview] = useState<string | null>(initialPreview);

  // Single-asset helpers (only used when allowMultiple=false)
  const single: SingleUpload | null = !Array.isArray(uploaded) ? uploaded : null;
  const wrappedImage = single && isImageAsset(single) ? single : null;
  const isWrappedPdf = !!(wrappedImage && imageResponseIsRawPdf(wrappedImage));
  const isImageUploaded =
    !!single && isImageAsset(single) && !imageResponseIsRawPdf(single as UploadedImageResponse);

  // Progress state
  const [progress, setProgress] = useState(0);
  const [indeterminate, setIndeterminate] = useState(false);
  const [uploading, setUploading] = useState(false);

  const notifyUploading = useCallback(
    (u: boolean) => {
      setUploading(u);
      onUploadingChange?.(u);
    },
    [onUploadingChange],
  );

  const notifyProgress = useCallback(
    (p: number, ind: boolean) => {
      setProgress(p);
      setIndeterminate(ind);
      onProgressChange?.(p, ind);
    },
    [onProgressChange],
  );

  // Accept map (images or PDFs)
  const imageAccept: Accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
  };
  const pdfOnlyAccept: Accept = { 'application/pdf': ['.pdf'] };
  const accept: Accept =
    mode === 'image'
      ? imageAccept
      : mode === 'file'
        ? pdfOnlyAccept
        : { ...imageAccept, ...pdfOnlyAccept };

  // === Upload handlers ===

  // Client → Cloudinary direct (images), with real progress
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const handleUploadImageDirect = useCallback(
    async (file: File): Promise<UploadedImageResponse> => {
      return uploadImageDirectWithVariants(
        file,
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          folder: `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER_PREFIX}/${folder}`,
          maxWidth: 2000,
          targetQuality: 0.85,
        },
        (pct) => notifyProgress(pct, false), // true byte-level progress
      );
    },
    [CLOUD_NAME, UPLOAD_PRESET, folder, notifyProgress],
  );

  // PDFs (or non-image files) still go through your server action
  const handleUploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER_PREFIX}/${folder}`);
      return (await uploadFileAction(formData)) as UploadedFileResponse;
    },
    [folder],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      notifyUploading(true);
      notifyProgress(0, false);

      if (!allowMultiple) {
        const file = acceptedFiles[0];
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        setPreview(isImage || isPdf ? URL.createObjectURL(file) : null);
      }

      // Real upload flow (no fake 60% plateau)
      startTransition(async () => {
        try {
          if (allowMultiple) {
            const results = await Promise.all(
              acceptedFiles.map(async (f) => {
                if (mode === 'image' || (mode === 'either' && f.type.startsWith('image/'))) {
                  // Direct image upload
                  return await handleUploadImageDirect(f);
                }
                // Non-image (PDF) path
                notifyProgress(0, true); // indeterminate for raw files
                const uploadedFile = await handleUploadFile(f);
                notifyProgress(100, false);
                return uploadedFile;
              }),
            );

            setUploaded((prev): UploadState => {
              const baseArr: SingleUpload[] = Array.isArray(prev)
                ? prev.slice()
                : prev
                  ? [prev]
                  : [];
              return [...baseArr, ...results];
            });
          } else {
            const file = acceptedFiles[0];
            let result: SingleUpload;

            if (mode === 'image' || (mode === 'either' && file.type.startsWith('image/'))) {
              // Direct image upload with true progress
              result = await handleUploadImageDirect(file);
              if (isImageAsset(result) && !imageResponseIsRawPdf(result)) {
                setPreview(result.main?.secure_url ?? null);
              }
            } else {
              // PDFs: use server action; progress is indeterminate
              notifyProgress(0, true);
              const uploadedFile = await handleUploadFile(file);
              result = uploadedFile;
              if (isPdfUploaded(uploadedFile)) {
                setPreview(uploadedFile.secure_url ?? null);
              }
            }

            setUploaded(result);
          }

          // finish UI
          notifyProgress(100, false);
          setTimeout(() => {
            notifyProgress(0, false);
            notifyUploading(false);
          }, 600);
        } catch (err) {
          console.error('Upload failed:', err);
          notifyProgress(0, false);
          notifyUploading(false);
          if (!allowMultiple) setPreview(null);
        }
      });
    },
    [
      notifyUploading,
      notifyProgress,
      allowMultiple,
      mode,
      handleUploadFile,
      handleUploadImageDirect,
      startTransition,
    ],
  );

  const onRemoveSingle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!single) return;
      try {
        notifyUploading(true);
        if (isImageAsset(single) && !imageResponseIsRawPdf(single)) {
          await deleteImageAction(single.main.public_id);
        } else {
          const publicId = isImageAsset(single)
            ? single.main.public_id
            : (single as UploadedFileResponse).public_id;
          await deleteFileAction(publicId);
        }
      } catch (err) {
        console.error('Failed to delete asset:', err);
      } finally {
        setUploaded(null);
        setPreview(null);
        notifyUploading(false);
      }
    },
    [notifyUploading, single],
  );

  const onRemoveAt = useCallback(
    async (idx: number) => {
      if (!Array.isArray(uploaded)) return;
      const item = uploaded[idx];
      try {
        notifyUploading(true);
        if (isImageAsset(item) && !imageResponseIsRawPdf(item)) {
          await deleteImageAction(item.main.public_id);
        } else {
          const publicId = isImageAsset(item)
            ? item.main.public_id
            : (item as UploadedFileResponse).public_id;
          await deleteFileAction(publicId);
        }
      } catch (err) {
        console.error('Failed to delete asset:', err);
      } finally {
        setUploaded(
          (prev): UploadState => (Array.isArray(prev) ? prev.filter((_, i) => i !== idx) : prev),
        );
        notifyUploading(false);
      }
    },
    [notifyUploading, uploaded],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    multiple: allowMultiple,
    maxSize: maxSize * 1024 * 1024,
  });

  const fileError = fileRejections[0]?.errors[0];

  // Hidden field value (single or array)
  const serializedValue = useMemo(() => {
    if (!uploaded) return '';
    return JSON.stringify(uploaded);
  }, [uploaded]);

  const busy = isPending || uploading || progress > 0;

  // == RENDER ==
  return (
    <div className={cn(styles.container, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          <span className="text-gray-400 ml-1 font-normal">(Click to upload)</span>
        </label>
      )}

      <input type="hidden" name={name} value={serializedValue} />

      <div
        {...getRootProps()}
        className={cn(
          styles.dropzone,
          !allowMultiple &&
            (preview || (single && isFileAsset(single))) &&
            styles.dropzoneWithPreview,
          isDragActive && styles.dropzoneActive,
          (error || fileError) && styles.dropzoneError,
        )}
      >
        <input {...getInputProps()} />

        {/* Uploading UI */}
        {busy && (
          <div className={styles.uploading}>
            <div className="relative w-12 h-12 mb-3">
              <FiUpload className={styles.uploadIcon} />
            </div>
            <p className={styles.uploadText}>{indeterminate ? 'Processing…' : 'Uploading…'}</p>
            <Progress
              value={progress}
              indeterminate={indeterminate}
              className={styles.uploadProgress}
            />
            {!indeterminate && (
              <span className="text-xs text-gray-500 mt-1">{progress}% complete</span>
            )}
          </div>
        )}

        {/* MULTI: grid previews */}
        {!busy && allowMultiple && Array.isArray(uploaded) && uploaded.length > 0 ? (
          <div className="w-100">
            <div className="row g-3">
              {uploaded.map((u, i) => {
                const isImg = isImageAsset(u) && !imageResponseIsRawPdf(u);
                const isPdf = (isImageAsset(u) && imageResponseIsRawPdf(u)) || isFileAsset(u);

                let thumb: string | undefined;
                if (isImg && isImageAsset(u)) {
                  thumb = u.main.secure_url;
                } else if (isPdf) {
                  if (isFileAsset(u)) {
                    thumb = u.secure_url;
                  } else if (isImageAsset(u)) {
                    thumb = u.main.secure_url;
                  }
                }

                return (
                  <div className="col-6 col-md-4 col-lg-3" key={i}>
                    <div className={styles.previewContainer} style={{ height: 180 }}>
                      {isImg && thumb ? (
                        <Image src={thumb} alt="Preview" fill className={styles.previewImage} />
                      ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100">
                          <FiFileText className={styles.uploadIcon} />
                          <small className="text-muted mt-1">
                            {isFileAsset(u)
                              ? u.original_filename || fileNameFromUrl(u.secure_url, 'file')
                              : 'document.pdf'}
                          </small>
                          {isFileAsset(u) && u.secure_url && (
                            <a
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 mt-2"
                              href={u.secure_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FiExternalLink /> Open
                            </a>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => onRemoveAt(i)}
                        className={styles.removeButton}
                        disabled={uploading}
                        aria-label="Remove"
                      >
                        <FiTrash2 className={styles.removeIcon} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* SINGLE: preview states */}
        {!busy && !allowMultiple && (
          <>
            {isImageUploaded && preview ? (
              <div className={styles.previewContainer}>
                <Image
                  src={preview}
                  alt="Preview"
                  width={400}
                  height={300}
                  className={styles.previewImage}
                  priority
                />
                <button
                  type="button"
                  onClick={onRemoveSingle}
                  className={styles.removeButton}
                  disabled={uploading}
                >
                  <FiTrash2 className={styles.removeIcon} />
                </button>
              </div>
            ) : single &&
              (isFileAsset(single) || isWrappedPdf) &&
              (preview || wrappedImage?.main?.secure_url) ? (
              <div className={styles.previewContainer}>
                <div
                  style={{
                    width: '100%',
                    height: 320,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    src={preview ?? wrappedImage!.main.secure_url}
                    title="PDF preview"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                  />
                </div>
                <div className="d-flex gap-2 mt-2">
                  {isFileAsset(single) && single.secure_url && (
                    <a
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      href={single.secure_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiExternalLink /> Open
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={onRemoveSingle}
                    className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                    disabled={uploading}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ) : !single ? (
              <div className={styles.emptyState}>
                <FiUpload className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {isDragActive ? 'Drop your file here' : 'Drag & drop or click to browse'}
                </p>
                <p className={styles.uploadHint}>
                  {mode === 'image'
                    ? `JPG, PNG, WEBP (Max ${maxSize}MB). Large images will be downscaled for faster upload.`
                    : `PDF only (Max ${maxSize}MB)`}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      {(fileError || error) && (
        <div className={styles.errorMessage}>
          {fileError?.code === 'file-too-large'
            ? `File is too large. Maximum size is ${maxSize}MB.`
            : fileError?.message || error}
        </div>
      )}
    </div>
  );
};
