'use client';

import dynamic from 'next/dynamic';

// Keep same import sites but lazy-load the actual spinner
export const ClipLoader = dynamic(() => import('react-spinners/ClipLoader'), {
  ssr: false,
  loading: () => <span className="text-muted">…</span>,
});
