// components/rich-text/HtmlContent.tsx
import React from 'react';
import parse, {
  type DOMNode,
  domToReact,
  type Element as HtmlElement,
  type HTMLReactParserOptions,
} from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import styles from './rich-content.module.css';

import { makeImageReplacer } from '@/lib/utils/make-image-replacer';
import { isElement } from '@/lib/utils/rich-image';

type Props = {
  html: string | null | undefined;
  className?: string;
  imageSizes?: string;
  heroUrl?: string | null;
  heroAlt?: string;
  heroWidth?: number;
  heroHeight?: number;
  badge?: React.ReactNode;
};

type Child = HtmlElement['children'][number];

function isNotCdata(n: Child): boolean {
  return (n as { type?: string }).type !== 'cdata';
}

function childrenToDom(nodes: HtmlElement['children']): DOMNode[] {
  const filtered: Child[] = (nodes ?? []).filter(isNotCdata);
  return filtered as unknown as DOMNode[];
}

/** Recursively check if a subtree contains a checkbox input */
function containsCheckbox(el: HtmlElement): boolean {
  const stack: DOMNode[] = Array.isArray(el.children) ? ([...el.children] as DOMNode[]) : [];
  while (stack.length) {
    const n = stack.pop() as DOMNode;
    if (!isElement(n)) continue;
    if (n.name === 'input' && (n.attribs?.type ?? '').toLowerCase() === 'checkbox') {
      return true;
    }
    if (Array.isArray(n.children)) {
      stack.push(...(n.children as DOMNode[]));
    }
  }
  return false;
}

/** preserve `data-cols` on <img> */
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (node.nodeName === 'IMG' && data.attrName === 'data-cols') {
    const v = String(data.attrValue ?? '').trim();
    if (!/^([2-4])$/.test(v)) data.keepAttr = false;
  }
});

export function RichContent({
  html,
  className,
  imageSizes,
  heroUrl,
  heroAlt,
  heroWidth,
  heroHeight,
  badge,
}: Props) {
  const clean = DOMPurify.sanitize(html ?? '', { ADD_ATTR: ['data-cols'] });

  // concrete image handler (exact signature & return types)
  const imageReplace = makeImageReplacer(styles, imageSizes);

  const options: HTMLReactParserOptions = {
    replace(domNode, index) {
      // 1) shared image handling
      const imgOut = imageReplace(domNode, index);
      if (imgOut !== undefined) return imgOut;

      // 2) rest of transforms
      if (domNode.type !== 'tag') return;
      const el = domNode as HtmlElement;

      if (el.name === 'ul') {
        const classAttr = el.attribs?.class || '';
        const looksLikeTask = /(^|\s)taskList(\s|$)/.test(classAttr) || containsCheckbox(el);

        if (looksLikeTask) {
          return <ul className="taskList">{domToReact(childrenToDom(el.children), options)}</ul>;
        }

        return <ul className={styles.rcList}>{domToReact(childrenToDom(el.children), options)}</ul>;
      }

      if (el.name === 'ol') {
        return <ol className={styles.rcOl}>{domToReact(childrenToDom(el.children), options)}</ol>;
      }

      if (el.name === 'li') {
        const parentEl = el.parent as HtmlElement | undefined;
        const parentClass = parentEl?.attribs?.class ?? '';
        const isTaskItem = /(^|\s)taskList(\s|$)/.test(parentClass) || containsCheckbox(el);

        if (isTaskItem) {
          return <li className="taskItem">{domToReact(childrenToDom(el.children), options)}</li>;
        }

        return (
          <li className={styles.rcListItem}>
            <FaCheckCircle className={styles.rcListIcon} aria-hidden="true" />
            <span className={styles.rcListContent}>
              {domToReact(childrenToDom(el.children), options)}
            </span>
          </li>
        );
      }

      if (el.name === 'a') {
        const href = el.attribs?.href || '#';
        const isHttp = /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            target={isHttp ? '_blank' : undefined}
            rel={isHttp ? 'noopener noreferrer nofollow' : undefined}
            className={styles.richLink}
          >
            {domToReact(childrenToDom(el.children), options)}
          </a>
        );
      }

      if (el.name === 'table') {
        return (
          <div className={styles.rcTableWrap}>
            <table className={styles.rcTable}>
              {domToReact(childrenToDom(el.children), options)}
            </table>
          </div>
        );
      }

      if (el.name === 'iframe') {
        const src = el.attribs?.src ?? '';
        const allowList = ['youtube.com', 'youtu.be', 'player.vimeo.com'];
        const ok = allowList.some((d) => src.includes(d));
        if (!ok) return <></>;
        return (
          <div className={styles.rcVideo}>
            <iframe
              src={src}
              title={el.attribs?.title || 'Embedded media'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        );
      }

      if (el.name === 'hr') return;
      return;
    },
  };

  return (
    <div className={`${styles.richContent} ${className ?? ''}`}>
      {heroUrl && (
        <div className={styles.RichHero} data-aos="fade-up" data-aos-delay="150">
          <Image
            src={heroUrl}
            alt={heroAlt ?? ''}
            width={heroWidth}
            height={heroHeight}
            className={styles.heroImage}
            sizes="(max-width: 992px) 100vw, 600px"
          />
          {badge && <div className={styles.RichHeroBadge}>{badge}</div>}
        </div>
      )}
      {parse(clean, options)}
    </div>
  );
}
