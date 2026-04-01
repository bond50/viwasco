// components/form-elements/image-dropzone/index.tsx
'use client';

import dynamic from 'next/dynamic';
import type { ImageDropzoneProps } from './types';

export const FileDropzone = dynamic<ImageDropzoneProps>(
  () => import('./client').then((m) => m.FileDropzone),
  {
    ssr: false,
    loading: () => <div className="text-muted">Loading uploader…</div>,
  },
);

export type { ImageDropzoneProps };
