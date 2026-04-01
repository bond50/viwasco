'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import styles from './progress.module.css';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // optional now
  max?: number;
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indeterminate = false, ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), max);

    return (
      <div
        ref={ref}
        className={cn(styles.progressContainer, className)}
        {...props}
        aria-busy={indeterminate ? 'true' : undefined}
        aria-valuemin={!indeterminate ? 0 : undefined}
        aria-valuemax={!indeterminate ? max : undefined}
        aria-valuenow={!indeterminate ? percentage : undefined}
        role="progressbar"
      >
        <div
          className={cn(styles.progressBar, indeterminate && styles.indeterminate)}
          style={!indeterminate ? { width: `${percentage}%` } : undefined}
        />
      </div>
    );
  },
);

Progress.displayName = 'Progress';
