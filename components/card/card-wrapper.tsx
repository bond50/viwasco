// components/card/CardWrapper.tsx
import React, { ReactNode } from 'react';
import { CardHeader } from './card-header';
import { Social } from '@/components/auth/social';
import styles from './Card.module.css';
import { cn } from '@/lib/utils';
import { BackNav } from '@/components/auth/back-button/BackNav';

interface CardWrapperProps {
  children: ReactNode;
  headerLabel?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  onBackClick?: () => void;
  showSocial?: boolean;
  className?: string;
  backVariant?: 'text' | 'outline';
  backSize?: 'sm' | 'md' | 'lg';
  showLogo?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  onBackClick,
  showSocial,
  className,
  backVariant = 'text',
  backSize = 'md',
  showLogo = true,
}: CardWrapperProps) => {
  // Warn if both are provided
  if (process.env.NODE_ENV !== 'production' && onBackClick && backButtonHref) {
    console.warn('CardWrapper: Provide either onBackClick or backButtonHref, not both.');
  }

  return (
    <div className={cn('card', styles.card, className)}>
      {headerLabel ? (
        <div className={cn('card-header', styles['card-header'])}>
          <CardHeader label={headerLabel} showLogo={showLogo} />
        </div>
      ) : null}

      <div className={cn('card-body', styles['card-body'])}>{children}</div>

      {showSocial && (
        <div className={cn('card-footer', styles['card-footer'])}>
          <Social />
        </div>
      )}

      {backButtonLabel ? (
        <div className={cn('card-footer', styles['card-footer'])}>
          {onBackClick ? (
            <BackNav
              label={backButtonLabel}
              onClick={onBackClick}
              variant={backVariant}
              size={backSize}
            />
          ) : backButtonHref ? (
            <BackNav
              label={backButtonLabel}
              href={backButtonHref}
              variant={backVariant}
              size={backSize}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CardWrapper;
