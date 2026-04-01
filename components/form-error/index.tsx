'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';

interface FormErrorProps {
  message?: string | string[] | null;
  autoDismissMs?: number; // default 4000
  dismissible?: boolean; // default false
}

export const FormError = ({
  message,
  autoDismissMs = 4000,
  dismissible = false,
}: FormErrorProps) => {
  const text = useMemo(() => {
    if (Array.isArray(message)) return message.filter(Boolean).join(', ');
    return message ?? '';
  }, [message]);

  const [open, setOpen] = useState<boolean>(Boolean(text));
  const timerRef = useRef<number | null>(null);

  // When the messages text changes, just start a new timer that closes it later.
  // We avoid "setState synchronously in effect" by not forcing open=true here.
  useEffect(() => {
    // reset any prior timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!text) {
      setOpen(false);
      return;
    }
    // show if currently closed (safe; still async close only)
    if (!open) setOpen(true);

    timerRef.current = window.setTimeout(() => setOpen(false), autoDismissMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoDismissMs]);

  if (!text || !open) return null;

  return (
    <div
      className="alert alert-danger d-flex align-items-start gap-2 p-3 rounded-2 shadow-sm small"
      role="alert"
      style={{ backgroundColor: '#f8d7da', border: 'none', color: '#842029' }}
    >
      <BsExclamationTriangle size={20} className="mt-1" />
      <div className="flex-grow-1">{text}</div>
      {dismissible && (
        <button
          type="button"
          aria-label="Close"
          className="btn-close"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};
