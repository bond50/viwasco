'use client';

import { useEffect, useRef } from 'react';

/**
 * Smooth two-phase header behavior with hysteresis:
 * Phase A: add `.scrolled-hide` (slides topbar out)
 * Phase B: add `.scrolled` (collapses spacer + white bg + shadow)
 *
 * - Uses useRef for state; only toggles classes when state changes.
 * - Direction-aware thresholds to avoid flicker (arrow keys / trackpads).
 * - Commit timing derived from the topbar's actual transform duration.
 * - Respects prefers-reduced-motion (skips animations).
 */
export default function HeaderScrollWatcher() {
  const rootRef = useRef<HTMLElement | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);

  const hidingRef = useRef(false);
  const committedRef = useRef(false);
  const tickingRef = useRef(false);

  const lastYRef = useRef(0);
  const downAccumRef = useRef(0);
  const upAccumRef = useRef(0);
  const commitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    rootRef.current = document.documentElement;
    topbarRef.current = document.querySelector<HTMLElement>('[data-topbar]') ?? null;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hysteresis thresholds (tweak if you want even calmer behavior)
    const ON = 80;  // px to start hiding while scrolling down
    const OFF = 24; // px from top (or up accumulation) to show again
    const MIN_STEP = 2; // ignore tiny micro-scroll
    const COMMIT_EXTRA = 24; // ms buffer after transform ends

    const getTransformDuration = () => {
      const el = topbarRef.current;
      if (!el) return 180;
      const dur = getComputedStyle(el).transitionDuration.split(',')[0]?.trim() ?? '';
      if (dur.endsWith('ms')) return Math.max(120, parseFloat(dur));
      if (dur.endsWith('s')) return Math.max(120, parseFloat(dur) * 1000);
      const n = parseFloat(dur);
      return Number.isFinite(n) ? Math.max(120, n) : 180;
    };

    const applyHide = (on: boolean) => {
      if (hidingRef.current === on) return;
      hidingRef.current = on;
      rootRef.current!.classList.toggle('scrolled-hide', on);
    };

    const applyCommit = (on: boolean) => {
      if (committedRef.current === on) return;
      committedRef.current = on;
      rootRef.current!.classList.toggle('scrolled', on);
    };

    const clearCommitTimer = () => {
      if (commitTimerRef.current != null) {
        window.clearTimeout(commitTimerRef.current);
        commitTimerRef.current = null;
      }
    };

    const scheduleCommit = () => {
      clearCommitTimer();
      const delay = prefersReduced ? 0 : getTransformDuration() + COMMIT_EXTRA;
      commitTimerRef.current = window.setTimeout(() => applyCommit(true), delay);
    };

    const evaluate = () => {
      const y = window.scrollY || 0;
      const dy = y - lastYRef.current;

      // tiny jitter -> ignore
      if (Math.abs(dy) < MIN_STEP) {
        tickingRef.current = false;
        return;
      }

      if (dy > 0) {
        // scrolling down
        downAccumRef.current += dy;
        upAccumRef.current = 0;

        if (!hidingRef.current && downAccumRef.current > ON) {
          applyHide(true);   // Phase A immediately (smooth slide)
          scheduleCommit();  // Phase B after transform
        }
      } else {
        // scrolling up
        upAccumRef.current += -dy;
        downAccumRef.current = 0;

        // Either near top or a meaningful upward scroll → reveal
        if (hidingRef.current && (y <= OFF || upAccumRef.current > ON)) {
          clearCommitTimer();
          // 1) Expand layout first (remove white bg/shadow + give space back)
          applyCommit(false);
          // 2) Next frame, slide the topbar back in
          requestAnimationFrame(() => applyHide(false));
        }
      }

      lastYRef.current = y;
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(evaluate);
      }
    };

    // initial pass
    lastYRef.current = window.scrollY || 0;
    if (lastYRef.current > ON) {
      applyHide(true);
      scheduleCommit();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearCommitTimer();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
