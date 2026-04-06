// components/public/home/hero/hero-resolver.tsx
import { fetchHeroConfig, type HeroContentMode } from '@/lib/data/public/hero-config';
import { VideoHero } from '@/components/public/home/hero/video';
import { ImageHero } from '@/components/public/home/hero/image';
import heroStyles from '@/components/public/home/hero/hero-base.module.css';

const FALLBACK_VIDEO_SRC = '/assets/video/water-hd.mp4';
const FALLBACK_POSTER = '/assets/video/water-hero-poster.jpg';

function resolveMode(useVideo: boolean, mode: HeroContentMode): HeroContentMode {
  // Video does not support carousel; image does not support swiper
  if (useVideo && mode === 'carousel') return 'single';
  if (!useVideo && mode === 'swiper') return 'single';
  return mode;
}

function buildMobileSubheading(text: string | null | undefined): string | undefined {
  const value = text?.trim();
  if (!value) return undefined;

  const sentenceMatch = value.match(/^.*?[.!?](?:\s|$)/);
  const firstSentence = sentenceMatch?.[0]?.trim() ?? value;

  if (firstSentence.length <= 110) {
    return firstSentence;
  }

  const sliced = firstSentence.slice(0, 107).replace(/\s+\S*$/, '');
  return `${sliced}...`;
}

export async function HeroResolver() {
  const cfg = await fetchHeroConfig();
  if (!cfg) return null;

  if (!cfg.enabled) return null;
  const { desktop, mobile } = cfg;

  if (!desktop.show && !mobile.show) return null;

  // Image: featuredImage JSON or strict fallback
  const imageSrc = cfg.image.src;

  // Video fallbacks
  const videoSrc = cfg.video?.src ?? FALLBACK_VIDEO_SRC;
  const mobileVideoSrc = cfg.video?.mobile ?? videoSrc;
  const poster = cfg.video?.poster ?? FALLBACK_POSTER;

  const desktopMode = resolveMode(desktop.useVideo, cfg.contentMode);
  const mobileMode = resolveMode(mobile.useVideo, cfg.contentMode);

  const mobileSubheading = buildMobileSubheading(cfg.subheading);
  const slides = cfg.slides;
  const mobileSlides = slides.map((slide) => ({
    ...slide,
    subheading: buildMobileSubheading(slide.subheading) ?? slide.subheading,
  }));

  return (
    <>
      {/* Desktop hero */}
      {desktop.show &&
        (desktop.useVideo ? (
          <VideoHero
            className={heroStyles.heroDesktopOnly}
            variant={cfg.variant}
            textAlign={desktop.textAlign}
            textChrome={desktop.textChrome}
            kicker={cfg.kicker ?? undefined}
            videoSrc={videoSrc}
            mobileSrc={mobileVideoSrc}
            poster={poster}
            heading={cfg.heading}
            subheading={cfg.subheading ?? undefined}
            contentMode={desktopMode}
            overlayStrength={desktop.overlayStrength}
            slides={slides}
          />
        ) : (
          <ImageHero
            className={heroStyles.heroDesktopOnly}
            variant={cfg.variant}
            textAlign={desktop.textAlign}
            textChrome={desktop.textChrome}
            kicker={cfg.kicker ?? undefined}
            imageSrc={imageSrc}
            heading={cfg.heading}
            subheading={cfg.subheading ?? undefined}
            contentMode={desktopMode}
            overlayStrength={desktop.overlayStrength}
            slides={slides}
          />
        ))}

      {/* Mobile hero */}
      {mobile.show &&
        (mobile.useVideo ? (
          <VideoHero
            className={heroStyles.heroMobileOnly}
            variant={cfg.variant}
            textAlign={mobile.textAlign}
            textChrome={mobile.textChrome}
            kicker={cfg.kicker ?? undefined}
            videoSrc={videoSrc}
            mobileSrc={mobileVideoSrc}
            poster={poster}
            heading={cfg.heading}
            subheading={mobileSubheading}
            contentMode={mobileMode}
            overlayStrength={mobile.overlayStrength}
            slides={mobileSlides}
          />
        ) : (
          <ImageHero
            className={heroStyles.heroMobileOnly}
            variant={cfg.variant}
            textAlign={mobile.textAlign}
            textChrome={mobile.textChrome}
            kicker={cfg.kicker ?? undefined}
            imageSrc={imageSrc}
            heading={cfg.heading}
            subheading={mobileSubheading}
            contentMode={mobileMode}
            overlayStrength={mobile.overlayStrength}
            slides={mobileSlides}
          />
        ))}
    </>
  );
}
