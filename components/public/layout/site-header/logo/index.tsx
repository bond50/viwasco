import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './logo.module.css';

type Props = {
  logoSrc?: string;
  className?: string;
  imageClassName?: string;
  imageHeight?: number;
  imageMaxWidth?: number;
  priority?: boolean;
};

export const Logo = ({
  logoSrc,
  className,
  imageClassName,
  imageHeight = 88,
  imageMaxWidth = 240,
  priority = true,
}: Props) => {
  return (
    <Link
      href="/"
      className={cn(
        styles.logo,
        className,
        'd-inline-flex',
        'align-items-center',
        'text-decoration-none',
      )}
      aria-label="Go to homepage"
    >
      <Image
        src={logoSrc ?? '/assets/img/logo.png'}
        alt="Viwasco Logo"
        width={505}
        height={494}
        sizes="(max-width: 575.98px) 160px, (max-width: 1199px) 200px, 240px"
        className={cn(styles.image, imageClassName)}
        style={{
          width: 'auto',
          height: imageHeight,
          maxWidth: imageMaxWidth,
        }}
        priority={priority}
      />
    </Link>
  );
};
