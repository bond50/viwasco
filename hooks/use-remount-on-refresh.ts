'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRemountOnRefresh(success: boolean | undefined, signal: unknown) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const previousSignalRef = useRef(signal);

  useEffect(() => {
    if (success) {
      router.refresh();
    }
  }, [success, router]);

  useEffect(() => {
    if (previousSignalRef.current === signal) return;

    previousSignalRef.current = signal;
    const timer = window.setTimeout(() => {
      setFormKey((current) => current + 1);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [signal]);

  return formKey;
}
