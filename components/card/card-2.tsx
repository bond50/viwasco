// components/card/CardWrapper2.tsx
import React, { ReactNode } from 'react';
import styles from './Card.module.css';
import { cn } from '@/lib/utils';

interface CardWrapperProps {
  children: ReactNode;
  headerLabel?: string | ReactNode;
  headerActions?: ReactNode;
  className?: string;
}

export const CardWrapper2 = ({
  children,
  headerLabel,
  headerActions,
  className,
}: CardWrapperProps) => {
  const hasHeader = headerLabel != null || headerActions != null;

  return (
    <div className={cn('card', className)}>
      {hasHeader && (
        <div className={cn('card-header', styles['card-header'], styles['card-header-2'])}>
          <div className={styles['card-header-content']}>
            {typeof headerLabel === 'string' ? (
              <h3 className={cn(styles['card-title'], 'mb-0')}>{headerLabel}</h3>
            ) : (
              <div className={cn(styles['card-title'], 'mb-0')}>{headerLabel}</div>
            )}
            {headerActions && <div className={styles['card-actions']}>{headerActions}</div>}
          </div>
        </div>
      )}

      <div className={cn('card-body', styles['card-body'])}>{children}</div>
    </div>
  );
};
