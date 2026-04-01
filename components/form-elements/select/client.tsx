'use client';

import React, { useState } from 'react';
import ReactSelect, { ActionMeta, MultiValue, OnChangeValue, SingleValue } from 'react-select';
import styles from '@/components/form-elements/input/input.module.css';
import type { GenericOption, SelectComponentProps } from './types';

const makeStableId = (seed: string, suffix = '') =>
  (suffix ? `${seed}__${suffix}` : seed).replace(/[^a-zA-Z0-9_-]/g, '_');

// Runtime helper that returns a correctly typed empty value for single/multi mode
function emptyValue<IsM extends boolean, TLabel>(
  isMulti: IsM,
): OnChangeValue<GenericOption<TLabel>, IsM> {
  return (isMulti ? [] : null) as OnChangeValue<GenericOption<TLabel>, IsM>;
}

export function Select<IsMulti extends boolean = false, TLabel = string>(
  props: SelectComponentProps<IsMulti, TLabel>,
) {
  const {
    name,
    label,
    placeholder = 'Select an option',
    value,
    defaultValue,
    error,
    className = '',
    onChange,
    isMulti,
    id,
    instanceId: forcedInstanceId,
    inputId: forcedInputId,
    ...rest
  } = props;

  // Simple, “good enough” stable ids — React Compiler will optimize this
  const instanceId = forcedInstanceId ?? makeStableId(name, 'select');
  const inputId = forcedInputId ?? id ?? makeStableId(name, 'input');
  const feedbackId = `${name}-feedback`;

  const isControlled = typeof value !== 'undefined';

  // Initial value for uncontrolled mode
  const initialUncontrolledValue: OnChangeValue<
    GenericOption<TLabel>,
    IsMulti
  > = typeof defaultValue !== 'undefined'
    ? (defaultValue as OnChangeValue<GenericOption<TLabel>, IsMulti>)
    : emptyValue<IsMulti, TLabel>(isMulti as IsMulti);

  const [internalValue, setInternalValue] =
    useState<OnChangeValue<GenericOption<TLabel>, IsMulti>>(initialUncontrolledValue);

  const currentValue: OnChangeValue<GenericOption<TLabel>, IsMulti> = isControlled
    ? (value as OnChangeValue<GenericOption<TLabel>, IsMulti>)
    : internalValue;

  const handleChange = (
    newValue: OnChangeValue<GenericOption<TLabel>, IsMulti>,
    actionMeta: ActionMeta<GenericOption<TLabel>>,
  ) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, actionMeta);
  };

  // This component is client-only (ssr: false), so document is always defined here
  const portalTarget = typeof document !== 'undefined' ? (document.body as HTMLElement) : undefined;

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className={styles.Label}>
          {label}
        </label>
      )}

      <ReactSelect<GenericOption<TLabel>, IsMulti>
        instanceId={instanceId}
        inputId={inputId}
        isMulti={isMulti}
        value={currentValue}
        onChange={handleChange}
        classNamePrefix="select"
        placeholder={placeholder}
        className={`${error ? 'is-invalid' : ''} ${className}`}
        menuPortalTarget={portalTarget}
        menuPosition={portalTarget ? 'fixed' : 'absolute'}
        styles={{
          ...rest.styles,
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({ ...base, zIndex: 9999 }),
        }}
        {...rest}
      />

      {/* Hidden inputs for native form posts */}
      <div style={{ display: 'none' }}>
        {Array.isArray(currentValue) ? (
          (currentValue as MultiValue<GenericOption<TLabel>>).map((opt) => (
            <input key={opt.value} type="hidden" name={name} value={opt.value} />
          ))
        ) : (
          <input
            type="hidden"
            name={name}
            value={(currentValue as SingleValue<GenericOption<TLabel>>)?.value ?? ''}
          />
        )}
      </div>

      {error && (
        <div id={feedbackId} className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
