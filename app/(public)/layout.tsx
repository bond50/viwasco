// app/layout.tsx

import { SiteHeader } from '@/components/public/layout/site-header';
import { connection } from 'next/server';

import React, { Suspense } from 'react';
import { Footer } from '@/components/public/layout/footer';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();

  return (
    <div>
      <Suspense
        fallback={
          <header className="sticky-top bg-white shadow-sm" style={{ height: '80px' }}>
            <div className="container h-100 d-flex align-items-center justify-content-between">
              <div className="skeleton-box" style={{ width: '150px', height: '40px' }}></div>
              <div className="skeleton-box" style={{ width: '400px', height: '20px' }}></div>
            </div>
          </header>
        }
      >
        <SiteHeader />
      </Suspense>
      {children}
      <Footer />
    </div>
  );
}
