import { ReactNode, Suspense } from 'react';
import { connection } from 'next/server';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './admin.css';

import { AdminBehaviors } from '@/components/admin/admin-behaviors';
import { Sidebar } from '@/components/admin/sidebar';
import { Footer } from '@/components/admin/footer';
import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await connection();

  return (
    // Scope admin fonts to this wrapper so Root fonts stay untouched
    <div>
      <AdminHeader />
      <Suspense fallback={<p>Loading sidebar</p>}>
        <Sidebar />
      </Suspense>
      <main id="admin-main">{children}</main>
      <Footer />
      <AdminBehaviors />
    </div>
  );
}
