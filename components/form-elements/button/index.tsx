// components/form-elements/button/Button.tsx
'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import styles from './button.module.css';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'outline'
  | 'text'
  | 'outline-primary'
  | 'outline-danger'
  | 'ghost';

type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      className,
      children,
      disabled,
      fullWidth,
      isLoading,
      icon,
      iconPosition = 'left',
      rounded = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          {
            [styles.fullWidth]: fullWidth,
            [styles.disabled]: disabled || isLoading,
            [styles.rounded]: rounded,
            [styles.loading]: isLoading,
          },
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        {icon && iconPosition === 'left' && !isLoading && (
          <span className={cn(styles.icon, styles.iconLeft)}>{icon}</span>
        )}
        <span className={styles.content}>{children}</span>
        {icon && iconPosition === 'right' && !isLoading && (
          <span className={cn(styles.icon, styles.iconRight)}>{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
