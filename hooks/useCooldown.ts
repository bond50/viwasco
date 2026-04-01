// hooks/useCooldown.ts
'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cooldown ticker with second resolution.
 * - initialSeconds can be computed from storage on the client.
 * - enabled controls whether the ticker runs.
 * - .start(seconds) sets a new cooldown.
 */
export function useCooldown(initialSeconds: number, enabled: boolean) {
  const [cooldown, setCooldown] = useState(initialSeconds);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || tickRef.current) return;
    tickRef.current = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000) as unknown as number;

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [enabled]);

  const start = (seconds: number) => setCooldown(seconds);

  return { cooldown, start };
}
