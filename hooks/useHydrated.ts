'use client';

import { useSyncExternalStore } from 'react';

export function useHydrated() {
  return useSyncExternalStore(
    (cb) => {
      (globalThis.queueMicrotask ?? ((f: () => void) => setTimeout(f, 0)))(cb);
      return () => {};
    },
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
