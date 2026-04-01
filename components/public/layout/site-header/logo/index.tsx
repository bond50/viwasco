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
  imageHeight = 56,
  imageMaxWidth = 150,
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
        width={504}
        height={594}
        sizes="(max-width: 575.98px) 118px, (max-width: 1199px) 132px, 150px"
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