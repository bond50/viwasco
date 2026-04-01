// components/public/home/hero/image/index.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from '@/components/public/home/hero/hero-base.module.css';
import { ImageHeroCarousel } from './image-carousel.client';
import { HeroSubtitle } from '@/components/public/home/hero/subtitle-accordion.client';

export type Variant = 'compact' | 'normal' | 'tall' | 'full';
export type ContentMode = 'single' | 'carousel' | 'swiper';
export type TextAlign = 'left' | 'center';
export type TextChrome = 'plain' | 'liquid' | 'boxed' | 'shadow';
export type OverlayStrength = 'none' | 'soft' | 'medium' | 'strong';

export type ImageHeroSlide = {
  id: string;
  kicker?: string | null;        // ← allow null
  heading: string;
  subheading?: string | null;    // ← allow null
};
type Props = {
  imageSrc: string;
  kicker?: string | null;
  heading: string;
  subheading?: string | null;
  variant?: Variant;
  textAlign?: TextAlign;
  textChrome?: TextChrome;
  className?: string;

  contentMode?: ContentMode;
  overlayStrength?: OverlayStrength;
  showScrollCue?: boolean;
  scrollHref?: string;

  /**
   * Optional slides for carousel mode.
   * Carousel is only enabled when contentMode === 'carousel' and slides.length >= 2.
   */
  slides?: ImageHeroSlide[];
};

export function ImageHero({
                            imageSrc,
                            kicker,
                            heading,
                            subheading,
                            variant = 'normal',
                            textAlign = 'left',
                            textChrome = 'plain',
                            className,
                            contentMode = 'single',
                            overlayStrength = 'medium',
                            showScrollCue = true,
                            scrollHref = '#scroll',
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

  const normalizedSlides: ImageHeroSlide[] =
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

  const canCarousel =
    contentMode === 'carousel' && normalizedSlides.length >= 2;

  const showOverlay = overlayStrength !== 'none';

  const overlayStrengthClass =
    overlayStrength === 'soft'
      ? styles.overlaySoft
      : overlayStrength === 'strong'
        ? styles.overlayStrong
        : undefined; // "medium" = base .overlay


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
      <div className={styles.mediaContainer} aria-hidden="true">
        <div
          className={styles.media}
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
        {showOverlay && (
          <div
            className={cn(
              styles.overlay,
              overlayStrengthClass,
            )}
          />
        )}

      </div>

      <div className={styles.container}>
        {canCarousel ? (
          <ImageHeroCarousel
            slides={normalizedSlides}
            textStyleClassName={textClasses}
          />
        ) : (
          <div className={textClasses}>
            {kicker && <span className={styles.kicker}>{kicker}</span>}
            <h1 className={styles.title}>{heading}</h1>
              {subheading && <HeroSubtitle text={subheading} />}
          </div>
        )}
      </div>

      {showScrollCue && (
        <Link href={scrollHref} className={styles.scrollCue} aria-label="Scroll down">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.scrollIcon}>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          </svg>
        </Link>
      )}
    </section>
  );
}
