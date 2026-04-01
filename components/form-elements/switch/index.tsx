// components/form-elements/switch/index.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import styles from '@/components/form-elements/input/input.module.css';
import switchStyles from './switch.module.css';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  labelPosition?: 'left' | 'right';
  error?: string;
  className?: string;
}

export const Switch = ({
  name,
  label,
  labelPosition = 'right',
  error,
  className = '',
  disabled = false,
  defaultChecked,
  checked,
  onChange,
  ...rest
}: SwitchProps) => {
  const feedbackId = `${name}-feedback`;

  return (
    <div className={cn('mb-3', className)}>
      <div
        className={cn(
          'd-flex align-items-center',
          labelPosition === 'left' ? 'flex-row-reverse justify-content-end' : '',
        )}
      >
        <div className={switchStyles.wrapper}>
          <input
            type="checkbox"
            id={name}
            name={name}
            className={cn(switchStyles.input, error && 'is-invalid')}
            aria-invalid={!!error}
            aria-describedby={error ? feedbackId : undefined}
            disabled={disabled}
            defaultChecked={defaultChecked}
            checked={checked}
            onChange={onChange} // ✅ forwarded
            {...rest} // (for onBlur, onFocus, etc.)
          />
          <label htmlFor={name} className={switchStyles.slider} />
        </div>

        {label && (
          <label
            htmlFor={name}
            className={cn(styles.Label, 'mb-0', {
              'me-2': labelPosition === 'right',
              'ms-0': labelPosition === 'left',
            })}
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <div id={feedbackId} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}
    </div>
  );
};
