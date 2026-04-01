'use client';

import * as React from 'react';
import { htmlToExcerpt } from '@/lib/text/excerpt';

type UseExcerptOptions = {
  initialBody?: string;
  initialExcerpt?: string;
  maxLen?: number; // default 220
  autoFillDefault?: boolean; // default true
};

export function useExcerpt(opts: UseExcerptOptions = {}) {
  const { initialBody = '', initialExcerpt = '', maxLen = 220, autoFillDefault = true } = opts;

  // generated from body
  const [generated, setGenerated] = React.useState(() => htmlToExcerpt(initialBody, maxLen));
  // user-facing excerpt value (can be auto or manual)
  const [excerpt, setExcerpt] = React.useState<string>(() => initialExcerpt || generated);
  // auto-fill toggle
  const [autoFill, setAutoFill] = React.useState<boolean>(autoFillDefault);

  // update generated when body changes
  const setBodyHtml = React.useCallback(
    (html: string) => {
      const g = htmlToExcerpt(html, maxLen);
      setGenerated(g);
    },
    [maxLen],
  );

  // keep excerpt synced when autoFill is ON
  React.useEffect(() => {
    if (autoFill) setExcerpt(generated);
  }, [generated, autoFill]);

  // helpers
  const toggleAutoFill = React.useCallback((val?: boolean) => {
    setAutoFill((prev) => (typeof val === 'boolean' ? val : !prev));
  }, []);

  const usePreviewAsCustom = React.useCallback(() => {
    setAutoFill(false);
    setExcerpt(generated);
  }, [generated]);

  const revertToAuto = React.useCallback(() => {
    setAutoFill(true);
  }, []);

  return {
    // state
    excerpt,
    setExcerpt,
    generated,
    autoFill,
    setAutoFill,
    toggleAutoFill,

    // actions
    setBodyHtml,
    usePreviewAsCustom,
    revertToAuto,
  };
}
