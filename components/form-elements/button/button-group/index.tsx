// components/form-elements/button/ButtonGroup.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import styles from './button-group.module.css';

type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
type Align = 'start' | 'center' | 'end' | 'stretch';

export interface ButtonGroupProps {
  children: React.ReactNode;
  /** Segmented look (shared borders, contiguous corners) */
  attached?: boolean;
  /** Column layout */
  vertical?: boolean;
  /** Allow wrapping on small screens */
  wrap?: boolean;
  /** Spacing between buttons (ignored when attached) */
  gap?: Gap;
  /** Align items along the cross-axis */
  align?: Align;
  className?: string;
  'aria-label'?: string; // accessibility label
}

export function ButtonGroup({
  children,
  attached = false,
  vertical = false,
  wrap = false,
  gap = 'sm',
  align = 'center',
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        styles.group,
        attached && styles.attached,
        vertical && styles.vertical,
        wrap && styles.wrap,
        styles[`gap-${gap}`],
        styles[`align-${align}`],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
