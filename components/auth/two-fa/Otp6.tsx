// components/auth/two-fa/Otp6.tsx
'use client';

import React from 'react';
import { CODE_LENGTH } from './constants';

type Props = {
  value: string;
  onChangeAction: (v: string) => void;
  disabled?: boolean;
  onCompleteAction?: (code: string) => void;
  length?: number; // default 6
};

export function Otp6({
  value,
  onChangeAction,
  disabled,
  onCompleteAction,
  length = CODE_LENGTH,
}: Props) {
  const inputs = Array.from({ length });
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = (value || '').padEnd(length, ' ').slice(0, length).split('');

  const commit = (chars: string[]) => {
    const joined = chars.join('').replace(/ /g, '');
    onChangeAction(joined);
    if (joined.length === length) onCompleteAction?.(joined);
  };

  const setDigit = (idx: number, ch: string) => {
    const clean = ch.replace(/\D/g, '').slice(0, 1);
    const next = digits.slice();
    next[idx] = clean || ' ';
    commit(next);
    if (clean && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx].trim() && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === 'ArrowLeft' && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onPaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (!txt) return;
    const next = digits.slice();
    for (let i = 0; i < Math.min(length - idx, txt.length); i++) next[idx + i] = txt[i];
    commit(next);
    const jump = Math.min(idx + txt.length, length - 1);
    refs.current[jump]?.focus();
  };

  return (
    <div className="d-flex gap-2" style={{ display: 'flex', gap: 8 }}>
      {inputs.map((_, i) => (
        <input
          id={`code-${i}`}
          key={i}
          ref={(el) => {
            refs.current[i] = el; // avoid returning a value
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={digits[i].trim() || ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
          className="form-control text-center p-0"
          style={{
            width: 44,
            height: 44,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 2,
            lineHeight: '44px',
            boxShadow: 'none',
            outline: 'none',
          }}
        />
      ))}
    </div>
  );
}
