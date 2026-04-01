// lib/utils/rich-image.tsx
import React from 'react';
import Image from 'next/image';
import type { DOMNode, Element as HtmlElement } from 'html-react-parser';

/**
 * Pass the CSS module that actually defines rcImgGrid/rcImgInline/etc.
 * e.g. import styles from "@/components/rich-text/rich-content.module.css"
 */
export type CssModule = Record<string, string>;

/* ───────── small utils (typed, lint-clean) ───────── */

export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** Wrapper aspect ratio (for unknown image dims) */
export const aspectStyle = (w?: number, h?: number): React.CSSProperties => ({
  aspectRatio: w && h ? `${w}/${h}` : '16/9',
});

/** Narrow guards so Array.filter has correct type */
export const isElement = (n: DOMNode): n is HtmlElement => n.type === 'tag';
export const isNamed =
  (name: string) =>
  (n: DOMNode): n is HtmlElement =>
    n.type === 'tag' && (n as HtmlElement).name === name;

export const isBr = isNamed('br');
export const isImg = isNamed('img');

/** text node with only whitespace? */
export function isWhitespace(n: DOMNode): boolean {
  if (n.type !== 'text') return false;
  const data = (n as unknown as { data?: string }).data ?? '';
  return data.trim() === '';
}

/** remove <br> + whitespace nodes (noise) */
export function withoutNoise(nodes: DOMNode[]): DOMNode[] {
  return nodes.filter((n) => !isWhitespace(n) && !isBr(n));
}

/**
 * Some editors wrap <img> in <a>/<span>/<strong>/<em> etc.
 * Peel one-child wrappers (up to 3 levels) to reach an <img>.
 */
export function unwrapToImg(n: DOMNode, depth = 0): HtmlElement | null {
  if (depth > 3) return null;
  if (isImg(n)) return n as HtmlElement;

  if (isElement(n)) {
    const el = n as HtmlElement;
    const rawKids = (el.children ?? []) as DOMNode[];
    const kids = withoutNoise(rawKids);
    if (kids.length === 1) return unwrapToImg(kids[0], depth + 1);
  }
  return null;
}

/**
 * If a <p> contains ONLY images (wrapped or not) + optional <br>/whitespace,
 * return those image <HtmlElement>s. Otherwise return [].
 */
export function collectImagesFromParagraph(p: HtmlElement): HtmlElement[] {
  if (p.name !== 'p') return [];
  const nodes = (p.children ?? []) as DOMNode[];
  const content = withoutNoise(nodes);
  const imgs = content.map(unwrapToImg).filter((x): x is HtmlElement => !!x);
  return imgs.length === content.length ? imgs : [];
}

/** Desired column count from first image’s data-cols (clamped 2..4, default 2) */
export function colsFrom(images: HtmlElement[]): 2 | 3 | 4 {
  const raw = Number(images[0]?.attribs?.['data-cols'] ?? 2);
  const val = Number.isFinite(raw) ? raw : 2;
  return clamp(val, 2, 4) as 2 | 3 | 4;
}

/* ───────── JSX renderers (use your exact classnames) ───────── */

/** Render a responsive image grid using your CSS module */
export function renderImageGrid(styles: CssModule, images: HtmlElement[], imageSizes?: string) {
  const cols = colsFrom(images);
  return (
    <div className={`${styles['rcImgGrid']} ${styles[`cols-${cols}`]}`}>
      {images.map((img, i) => {
        const src = img.attribs?.src;
        if (!src) return null;
        const alt = img.attribs?.alt || '';
        const w = Number(img.attribs?.width) || undefined;
        const h = Number(img.attribs?.height) || undefined;

        return (
          <span key={i} className={styles['rcImgGridItem']} style={aspectStyle(w, h)}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={imageSizes ?? '(min-width:1280px) 1100px, (min-width:1024px) 900px, 100vw'}
              className={`${styles['rcImgGridImg']} img-fluid`}
            />
          </span>
        );
      })}
    </div>
  );
}

/** Render one image (unknown dims → ratio wrapper+fill; known dims → intrinsic) */
export function renderSingleImage(styles: CssModule, img: HtmlElement, imageSizes?: string) {
  const src = img.attribs?.src;
  if (!src) return <></>;
  const alt = img.attribs?.alt || '';
  const w = Number(img.attribs?.width) || undefined;
  const h = Number(img.attribs?.height) || undefined;

  if (!w || !h) {
    return (
      <span className={styles['rcImgWrapAuto']} style={aspectStyle(w, h)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={imageSizes ?? '(min-width:1280px) 1100px, (min-width:1024px) 900px, 100vw'}
          className={`${styles['rcImg']} img-fluid`}
          style={{ objectFit: 'contain' }}
        />
      </span>
    );
  }

  return (
    <span className={styles['rcImgInline']}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes={imageSizes ?? '(min-width:1024px) 900px, 100vw'}
        className={`${styles['rcImg']} img-fluid`}
        style={{ width: '100%', height: 'auto' }}
      />
    </span>
  );
}
