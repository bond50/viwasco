import { ReactNode, Suspense } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './admin.css';

import { AdminBehaviors } from '@/components/admin/admin-behaviors';
import { Sidebar } from '@/components/admin/sidebar';
import { Footer } from '@/components/admin/footer';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({ children }: { children: ReactNode }) {
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
