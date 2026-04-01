import * as React from 'react';

type VideoSource = {
  src: string;
  type?: string; // e.g. "video/mp4"
  media?: string; // e.g. "(max-width: 768px)"
};

type Props = {
  /** Fallback source (last <source> if `sources` provided) */
  src?: string;
  /** Optional multiple <source> with media queries */
  sources?: ReadonlyArray<VideoSource>;
  poster?: string;
  className?: string;

  /** Presentation / accessibility */
  decorative?: boolean;
  ariaLabel?: string;

  /** Native video attrs */
  preload?: 'none' | 'metadata' | 'auto';
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  controls?: boolean;

  /** Extra children (rarely needed) */
  children?: React.ReactNode;
};

export function NextVideo({
  src,
  sources,
  poster,
  className,
  decorative = false,
  ariaLabel,
  preload = 'none',
  muted = true,
  loop = true,
  autoPlay = true,
  playsInline = true,
  controls = false,
  children,
}: Props) {
  const commonA11y = decorative ? { 'aria-hidden': true } : { 'aria-label': ariaLabel ?? 'Video' };

  return (
    <video
      className={className}
      poster={poster}
      preload={preload}
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
      playsInline={playsInline}
      controls={controls}
      {...commonA11y}
    >
      {sources?.map(({ src: s, type = 'video/mp4', media }, i) => (
        <source key={`${s}-${i}`} src={s} type={type} media={media} />
      ))}
      {src ? <source src={src} type="video/mp4" /> : null}
      {children}
      Your browser does not support the video tag.
    </video>
  );
}
