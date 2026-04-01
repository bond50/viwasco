// lib/utils/make-image-replacer.tsx

import type { DOMNode, Element as HtmlElement } from 'html-react-parser';
import type { CssModule } from './rich-image';
import { collectImagesFromParagraph, renderImageGrid, renderSingleImage } from './rich-image';
import { JSX } from 'react';

/**
 * Return a concrete replace handler with the exact signature html-react-parser expects:
 * (node, index) => JSX.Element | string | null | boolean | object | void
 *
 * (We also mark `index` as used via `void index;` to satisfy ESLint.)
 */
export function makeImageReplacer(
  styles: CssModule,
  imageSizes?: string,
): (node: DOMNode, index: number) => JSX.Element | string | null | boolean | object | void {
  return function replace(domNode: DOMNode, index: number) {
    void index; // keep ESLint happy

    if (domNode.type !== 'tag') return;
    const el = domNode as HtmlElement;

    // Paragraph that is pure images (or wrapped images)
    if (el.name === 'p') {
      const imgs = collectImagesFromParagraph(el);
      if (imgs.length >= 2) return renderImageGrid(styles, imgs, imageSizes);
      if (imgs.length === 1) return renderSingleImage(styles, imgs[0], imageSizes);
      return; // normal paragraph
    }

    // Standalone <img>
    if (el.name === 'img') {
      return renderSingleImage(styles, el, imageSizes);
    }

    return;
  };
}
