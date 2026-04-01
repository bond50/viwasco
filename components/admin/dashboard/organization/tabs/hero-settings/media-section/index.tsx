// components/admin/dashboard/organization/tabs/hero-settings/media-section/index.tsx
import React from 'react';
import { CloudinaryVideoPicker } from '@/components/admin/media/cloudinary-video-picker';

const DEFAULT_DESKTOP_VIDEO = '/assets/video/water-hd1.mp4';
const DEFAULT_MOBILE_VIDEO = '/assets/video/water-sd.mp4';
const DEFAULT_POSTER = '/assets/video/water-hero-poster.jpg';

export type HeroMediaSectionProps = {
  useVideoMode: boolean;
  videoUrlCurrent: string;
};

export const HeroMediaSection: React.FC<HeroMediaSectionProps> = ({
  useVideoMode,
  videoUrlCurrent,
}) => {
  if (!useVideoMode) {
    return (
      <div className="card mb-3 border">
        <div className="card-body">
          <h6 className="card-title mb-1">Image mode</h6>
          <p className="mb-0 text-muted small">
            In <strong>Image hero</strong> mode, the background uses the organization&apos;s{' '}
            <strong>Featured Image</strong> from Basic / Identity settings. No extra configuration
            is required here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3 border">
      <div className="card-body">
        <h6 className="card-title mb-1">
          Video mode
          <span
            suppressHydrationWarning
            className="ms-2 text-muted"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="If you don’t provide a URL, a default water video will be used."
          >
            <i className="bi bi-info-circle" aria-hidden="true" />
          </span>
        </h6>

        <p className="text-muted small mb-3">
          Upload or select an intro video. If left empty, the system falls back to:
          <br />
          <code>{DEFAULT_DESKTOP_VIDEO}</code> (desktop) · <code>{DEFAULT_MOBILE_VIDEO}</code>{' '}
          (mobile) · <code>{DEFAULT_POSTER}</code> (poster image).
        </p>

        <CloudinaryVideoPicker
          name="videoSrc"
          label="Cloudinary intro video"
          initialUrl={videoUrlCurrent}
          folder="organizations/hero"
          helpText="Upload to Cloudinary or paste a direct video URL. Leave blank to use the default water video."
        />

        <p className="small text-muted mb-0 mt-3">
          <strong>Poster image</strong> is shown while the video is loading or when autoplay is
          blocked. The default poster is <code>{DEFAULT_POSTER}</code>.
        </p>
      </div>
    </div>
  );
};
