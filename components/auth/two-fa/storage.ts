// components/auth/two-fa/storage.ts
'use client';

import { COOLDOWN_SEC, INIT_SENT_KEY, SENT_AT_KEY } from './constants';

const nowMs = () => Date.now();

export function remainingCooldownSec(): number {
  try {
    const last = Number(sessionStorage.getItem(SENT_AT_KEY) || '0');
    const left = COOLDOWN_SEC - Math.floor((nowMs() - last) / 1000);
    return Math.max(0, left);
  } catch {
    return 0;
  }
}

export function markSent() {
  try {
    sessionStorage.setItem(SENT_AT_KEY, String(nowMs()));
    sessionStorage.setItem(INIT_SENT_KEY, '1');
  } catch {}
}

export function clearSent() {
  try {
    sessionStorage.removeItem(SENT_AT_KEY);
    sessionStorage.removeItem(INIT_SENT_KEY);
  } catch {}
}

export function alreadySentOnce(): boolean {
  try {
    return !!sessionStorage.getItem(INIT_SENT_KEY);
  } catch {
    return false;
  }
}
