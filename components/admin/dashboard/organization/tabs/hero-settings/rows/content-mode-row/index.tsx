import React from 'react';
import type { HeroState } from '@/lib/types/about';

type HeroContentMode = HeroState['contentMode'];

export type HeroContentModeRowProps = {
  useVideoMode: boolean;
  contentMode: HeroContentMode;
  onChange: (mode: HeroContentMode) => void;
};

export const HeroContentModeRow: React.FC<HeroContentModeRowProps> = ({
  useVideoMode,
  contentMode,
  onChange,
}) => {
  const isVideo = useVideoMode;

  const options: { value: HeroContentMode; label: string }[] = isVideo
    ? [
        { value: 'single', label: 'Single hero (video only)' },
        { value: 'swiper', label: 'Text swiper on video background' },
      ]
    : [
        { value: 'single', label: 'Single hero (static)' },
        { value: 'carousel', label: 'Carousel (multiple image slides)' },
      ];

  const helpText = isVideo
    ? 'Use one video hero, or let text captions swipe on top of the video.'
    : 'Use a single static hero, or a carousel to rotate multiple image slides.';

  const safeValue = options.some((opt) => opt.value === contentMode) ? contentMode : 'single';

  const tooltipText = 'Single = current behaviour. Carousel / Swiper will rotate multiple items.';

  return (
    <div className="row mb-3">
      <label className="col-sm-3 col-form-label">
        Content mode
        <span className="ms-1 text-muted" title={tooltipText} aria-label={tooltipText}>
          <i className="bi bi-info-circle" aria-hidden="true" />
        </span>
      </label>
      <div className="col-sm-9">
        <select
          className="form-select"
          name="contentMode"
          value={safeValue}
          onChange={(e) => onChange(e.target.value as HeroContentMode)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="form-text">{helpText}</div>
      </div>
    </div>
  );
};
