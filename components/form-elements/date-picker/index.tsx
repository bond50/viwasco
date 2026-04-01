'use client';

import dynamic from 'next/dynamic';

export const CustomDatePicker = dynamic(() => import('./client').then((m) => m.CustomDatePicker), {
  ssr: false,
  loading: () => <span className="text-muted">Loading date picker…</span>,
});
