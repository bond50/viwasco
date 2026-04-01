'use client';

import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import styles from '@/components/form-elements/input/input.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { isValid, parseISO } from 'date-fns';

interface DatePickerProps {
  name: string;
  /** Optional fixed id; if omitted, we'll use `${name}__picker` */
  id?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  /** Accepts ISO yyyy-MM-dd, Date, or null */
  defaultValue?: string | Date | null;
  /** Controlled value (Date). If provided, component is controlled */
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

/** SSR-safe: make a deterministic id from the field name */
const makeStableId = (name: string) => `${name}__picker`.replace(/[^a-zA-Z0-9_-]/g, '_');

export const CustomDatePicker = ({
  name,
  id,
  label,
  placeholder = 'Select date',
  error,
  defaultValue,
  value,
  onChange,
  className = '',
  required = false,
  minDate,
  maxDate,
}: DatePickerProps) => {
  // 👇 SSR-safe, deterministic ID
  const instanceId = useMemo(() => id ?? makeStableId(name), [id, name]);
  const feedbackId = `${name}-feedback`;
  const isControlled = value !== undefined;

  // Normalize defaultValue only once (client), but the logic is deterministic.
  const initial = useMemo<Date | null>(() => {
    if (defaultValue instanceof Date) return isValid(defaultValue) ? defaultValue : null;
    if (typeof defaultValue === 'string') {
      const d = parseISO(defaultValue);
      return isValid(d) ? d : null;
    }
    return null;
  }, [defaultValue]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(initial);

  const handleChange = (date: Date | null) => {
    if (!isControlled) setSelectedDate(date);
    onChange?.(date);
  };

  const currentValue = isControlled ? (value ?? null) : selectedDate;

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={instanceId} className={styles.Label}>
          {label}
        </label>
      )}

      <DatePicker
        id={instanceId}
        selected={currentValue}
        onChange={handleChange}
        placeholderText={placeholder}
        className={`${styles.Input} ${error ? 'is-invalid' : ''} ${className} w-100`}
        dateFormat="yyyy-MM-dd"
        name={`${name}__picker`} // visual input; real value is posted via the hidden input
        required={required}
        minDate={minDate}
        maxDate={maxDate}
        wrapperClassName="w-100"
      />

      {/* Hidden input that actually posts the ISO date (yyyy-MM-dd) */}
      <input
        type="hidden"
        name={name}
        value={currentValue ? currentValue.toISOString().split('T')[0] : ''}
      />

      {error && (
        <div id={feedbackId} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}
    </div>
  );
};
