// components/public/home/hero/video/index.tsx
import { cn } from '@/lib/utils';
import { NextVideo } from '@/components/common/media/next-video';
import { SmoothLoop } from './smooth-loop.client';
import { TextSwiper } from './text-swiper.client';
import styles from '@/components/public/home/hero/hero-base.module.css';
import { HeroSubtitle } from '@/components/public/home/hero/subtitle-accordion.client';
import Link from 'next/link';

type Stat = { number: number | string; label: string };

export type Variant = 'compact' | 'normal' | 'tall' | 'full';
export type ContentMode = 'single' | 'carousel' | 'swiper';
export type TextAlign = 'left' | 'center';
export type TextChrome = 'plain' | 'liquid' | 'boxed' | 'shadow';
export type OverlayStrength = 'none' | 'soft' | 'medium' | 'strong';

export type VideoHeroSlide = {
  id: string;
  kicker?: string | null;      // ← allow null
  heading: string;
  subheading?: string | null;  // ← allow null too
};

type Props = {
  videoSrc: string;
  mobileSrc?: string;
  poster?: string;

  kicker?: string | null;        // ← allow null
  heading: string;
  subheading?: string | null;    // ← allow null

  stats?: Stat[];

  variant?: Variant;
  textAlign?: TextAlign;
  textChrome?: TextChrome;
  className?: string;

  contentMode?: ContentMode;

  overlayStrength?: OverlayStrength;
  showScrollCue?: boolean;
  /**
   * Optional slides for swiper mode.
   * Swiper is only enabled when contentMode === 'swiper' and slides.length >= 2.
   */
  slides?: VideoHeroSlide[];
};

export function VideoHero({
                            videoSrc,
                            mobileSrc,
                            poster,
                            kicker,
                            heading,
                            subheading,
                            stats = [],
                            variant = 'normal',
                            textAlign = 'left',
                            textChrome = 'plain',
                            className,
                            contentMode = 'single',
                            overlayStrength = 'medium',
                            showScrollCue = false,
                            slides,
                          }: Props) {
  const alignClass = textAlign === 'left' ? styles.tvLeft : styles.tvCenter;
  const chromeClass =
    textChrome === 'liquid'
      ? styles.tvLiquid
      : textChrome === 'boxed'
        ? styles.tvBoxed
        : textChrome === 'shadow'
          ? styles.tvShadow
          : undefined;

  const textClasses = cn(styles.content, chromeClass, alignClass);

  // Prepare swiper slides; if none provided, derive a single slide from props
  const normalizedSlides: VideoHeroSlide[] =
    slides && slides.length > 0
      ? slides.map((s) => ({
        id: s.id,
        kicker: s.kicker ?? undefined,
        heading: s.heading,
        subheading: s.subheading ?? undefined,
      }))
      : [
        {
          id: 'main',
          kicker,
          heading,
          subheading,
        },
      ];

  const canSwiper =
    contentMode === 'swiper' && normalizedSlides.length >= 2;

  const showOverlay = overlayStrength !== 'none';

  const overlayStrengthClass =
    overlayStrength === 'soft'
      ? styles.overlaySoft
      : overlayStrength === 'strong'
        ? styles.overlayStrong
        : undefined;
  const overlayPositionClass = textAlign === 'left' ? styles.overlayLeft : undefined;

  return (
    <section
      className={cn(
        styles.hero,
        styles[variant],
        'dark-background',
        className ?? '',
        contentMode !== 'single' ? styles[`mode-${contentMode}`] ?? '' : '',
      )}
      aria-label="Hero"
    >
      {/* Background video */}
      <div className={styles.mediaContainer} aria-hidden="true">
        <NextVideo
          className={styles.media}
          poster={poster}
          decorative
          preload="none"
          muted
          loop
          autoPlay
          playsInline
          sources={
            mobileSrc
              ? [{ src: mobileSrc, type: 'video/mp4', media: '(max-width: 768px)' }]
              : undefined
          }
          src={videoSrc}
        />
        {showOverlay && (
          <div
            className={cn(
              styles.overlay,
              overlayStrengthClass,
              overlayPositionClass,
            )}
          />
        )}

        <SmoothLoop selector={`.${styles.media}`} />
      </div>

      {/* Foreground content */}
      <div className={styles.container}>
        {canSwiper ? (
          <TextSwiper slides={normalizedSlides} textStyleClassName={textClasses} />
        ) : (
          <div className={textClasses}>
            {kicker && <span className={styles.kicker}>{kicker}</span>}
            <h1 className={styles.title}>{heading}</h1>
              {subheading && <HeroSubtitle text={subheading}  />}

            {stats.length > 0 && (
              <div className={styles.stats}>
                <div className={styles.statsGrid}>
                  {stats.map((s, i) => (
                    <div key={i} className={styles.statItem}>
                      <span className={styles.statNumber}>{s.number}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showScrollCue ? (
        <Link href="#service-overview" className={styles.scrollCue} aria-label="Scroll to next section">
          <svg className={styles.scrollIcon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16.5a1 1 0 0 1-.7-.29l-6-6a1 1 0 1 1 1.4-1.42L12 14.08l5.3-5.29a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-.7.29Z" />
          </svg>
        </Link>
      ) : null}
    </section>
  );
}
