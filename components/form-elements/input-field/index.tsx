// components/new/InputField.tsx
'use client';

import React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import styles from './InputField.module.css';
import { cn } from '@/lib/utils';

interface InputFieldProps<T extends FieldValues = FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  as?: 'input' | 'textarea';
  className?: string;
  [key: string]: unknown;
}

export default function InputField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  as = 'input',
  className = '',
  ...props
}: InputFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const Component = as === 'textarea' ? 'textarea' : 'input';
  const wrapperClasses = cn(
    styles.wrapper,
    error && styles.error,
    as === 'textarea' && styles.textareaWrapper,
    className,
  );

  return (
    <>
      <div className={wrapperClasses}>
        <Component
          {...field}
          {...props}
          id={name}
          type={type}
          placeholder=" "
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-feedback` : undefined}
          className={cn(styles.input, as === 'textarea' && styles.textarea)}
        />
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      </div>
      {error && (
        <div id={`${name}-feedback`} className={styles.feedback}>
          {error.message}
        </div>
      )}
    </>
  );
}
