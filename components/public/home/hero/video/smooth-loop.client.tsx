'use client';

import { useEffect } from 'react';

/**
 * Nudge the playhead just before the end so the "ended" boundary is never hit.
 * This avoids the visible blink some encodes cause when looping.
 */
export function SmoothLoop({
  selector,
  epsilon = 0.06, // ~60ms; tweak if your encode still shows a micro-gap
}: {
  selector: string;
  epsilon?: number;
}) {
  useEffect(() => {
    const el = document.querySelector<HTMLVideoElement>(selector);
    if (!el) return;

    // Keep looping perfectly even if the file has encoder delay at tail
    const onTimeUpdate = () => {
      const d = el.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      // When close to the end, jump to start and keep playing
      if (d - el.currentTime <= epsilon) {
        el.currentTime = 0.001;
        if (!el.paused) el.play().catch(() => {});
      }
    };

    // Fallback if ended is still fired (some browsers)
    const onEnded = () => {
      el.currentTime = 0.001;
      el.play().catch(() => {});
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
    };
  }, [selector, epsilon]);

  return null;
}
