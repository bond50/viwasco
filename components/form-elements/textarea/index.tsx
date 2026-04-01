'use client';

import { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
  registration: Partial<UseFormRegisterReturn>;
  error?: string;
}

export const TextArea = ({
  label,
  placeholder,
  className,
  disabled,
  rows = 3,
  registration,
  error,
}: TextAreaProps) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={registration.name} className="form-label">
          {label}
        </label>
      )}
      <textarea
        id={registration.name}
        className={cn('new-control', error && 'is-invalid', className)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...registration}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
