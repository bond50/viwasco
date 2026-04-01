'use client';

import { useEffect, useState } from 'react';
import { useHydrated } from './useHydrated';

export function useMediaQuery(query: string) {
  const hydrated = useHydrated();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [hydrated, query]);

  return hydrated && matches;
}
