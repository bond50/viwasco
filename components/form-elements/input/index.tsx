// input.tsx
import styles from '@/components/form-elements/input/input.module.css';
import { cn } from '@/lib/utils';
import React from 'react';

interface SharedProps {
  label?: string;
  as?: 'input' | 'textarea';
  name: string;
  error?: string;
  className?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url'; // Added number type
}

type InputProps =
  | (SharedProps & React.InputHTMLAttributes<HTMLInputElement> & { as?: 'input' })
  | (SharedProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' });

export const Input = (props: InputProps) => {
  const { label, as = 'input', name, error, className = '', type = 'text', ...rest } = props;

  const feedbackId = `${name}-feedback`;

  const commonProps = {
    id: name,
    name,
    'aria-invalid': !!error,
    'aria-describedby': error ? feedbackId : undefined,
    className: cn('form-control', error && 'is-invalid', className),
  };

  // Handle number inputs to prevent negative core-values and decimals where not wanted
  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      if (['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className={styles.Label}>
          {label}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          {...commonProps}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={cn(commonProps.className, styles.Textarea)}
        />
      ) : (
        <input
          type={type}
          {...commonProps}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          className={cn(commonProps.className, styles.Input)}
          onKeyDown={type === 'number' ? handleNumberInput : undefined}
          step={type === 'number' ? 'any' : undefined}
        />
      )}

      {error && (
        <div id={feedbackId} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};
