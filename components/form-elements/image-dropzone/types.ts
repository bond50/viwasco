// components/form-elements/image-dropzone/types.ts
import type { UploadedAsset } from '@/lib/assets/core';

export interface ImageDropzoneProps {
  name: string;
  label?: string;
  error?: string;
  folder?: string;
  /** single or array shape (backward compatible) */
  defaultValue?: UploadedAsset | UploadedAsset[] | null;
  maxSize?: number;
  className?: string;
  /** 'image' -> images only, 'file' -> PDFs only, 'either' -> both */
  mode?: 'image' | 'file' | 'either';
  /** enable multiple uploads (serialized as JSON array) */
  allowMultiple?: boolean;

  /** bubble upload state up so parent can disable submit */
  onUploadingChange?: (uploading: boolean) => void;

  /** Optional: progress callback (0..100, indeterminate flag) */
  onProgressChange?: (progress: number, indeterminate: boolean) => void;
}
