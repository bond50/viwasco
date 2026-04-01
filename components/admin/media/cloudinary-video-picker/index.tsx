'use client';

import { useRef, useState, useTransition } from 'react';

import { uploadFileAction } from '@/actions/file-upload';

type Props = {
  name: string;
  label: string;
  initialUrl?: string;
  helpText?: string;
  folder?: string;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const FOLDER_PREFIX = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER_PREFIX ?? '';
const MAX_VIDEO_SIZE_MB = 5;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

function joinFolder(prefix: string, folder: string): string {
  const parts = [prefix, folder]
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ''));

  return parts.join('/') || 'hero';
}

export function CloudinaryVideoPicker({
  name,
  label,
  initialUrl,
  helpText,
  folder = 'hero',
}: Props) {
  const [value, setValue] = useState(initialUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const envMissing = !CLOUD_NAME;
  const uploadFolder = joinFolder(FOLDER_PREFIX, folder);

  const handleBrowse = () => {
    if (envMissing) {
      setError('Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.');
      return;
    }

    inputRef.current?.click();
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setError(`Video must be ${MAX_VIDEO_SIZE_MB}MB or smaller.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', uploadFolder);

        const uploaded = await uploadFileAction(formData);
        setValue(uploaded.secure_url || uploaded.url || '');
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : 'Video upload failed.';
        setError(message);
      } finally {
        if (inputRef.current) inputRef.current.value = '';
      }
    });
  };

  const handleClear = () => {
    setValue('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div className="mb-2">
        <label className="form-label" htmlFor={`${name}-input`}>
          {label}
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="d-none"
          onChange={handleSelectFile}
        />

        <div className="input-group">
          <input
            id={`${name}-input`}
            className="form-control"
            type="url"
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://res.cloudinary.com/your-cloud/video/upload/intro.mp4"
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleBrowse}
            disabled={isPending}
          >
            {isPending ? 'Uploading…' : 'Upload…'}
          </button>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleClear}
            disabled={!value && !isPending}
          >
            Clear
          </button>
        </div>

        {helpText && <div className="form-text">{helpText}</div>}
        <div className="form-text">
          Recommended: 720p, 5 to 10 seconds, muted, and {MAX_VIDEO_SIZE_MB}MB or less.
        </div>
        <div className="form-text">
          Uploads use Cloudinary folder: <code>{uploadFolder}</code>
        </div>
        {error && <div className="text-danger small mt-1">{error}</div>}
      </div>

      {value && (
        <div className="mt-2">
          <video
            src={value}
            controls
            className="w-100 rounded border"
            style={{ maxHeight: 220, objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
}
