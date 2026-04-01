import { Suspense } from 'react';

import { HeaderBrand } from '@/components/admin/admin-header/header-brand';
import { HeaderNav } from '@/components/admin/admin-header/header-nav';

export function AdminHeader() {
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <HeaderBrand />
      <Suspense fallback={<HeaderNavFallback />}>
        <HeaderNav />
      </Suspense>
    </header>
  );
}

export default AdminHeader;

function HeaderNavFallback() {
  return (
    <nav className="header-nav ms-auto" aria-label="Admin header">
      <ul className="d-flex align-items-center">
        <li className="nav-item d-block d-lg-none">
          <button
            type="button"
            className="nav-link nav-icon search-bar-toggle bg-transparent border-0 p-0"
            aria-label="Toggle search"
          >
            <i className="bi bi-search" aria-hidden="true" />
          </button>
        </li>
        <li className="nav-item">
          <span className="nav-link nav-icon bg-transparent border-0 p-0" aria-hidden="true">
            <i className="bi bi-bell" />
          </span>
        </li>
        <li className="nav-item">
          <span className="nav-link nav-icon bg-transparent border-0 p-0" aria-hidden="true">
            <i className="bi bi-chat-left-text" />
          </span>
        </li>
        <li className="nav-item">
          <span
            className="nav-link nav-profile d-flex align-items-center pe-0 bg-transparent border-0"
            aria-hidden="true"
          >
            <span
              className="rounded-circle d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary fw-semibold"
              style={{ width: 36, height: 36, fontSize: '0.8rem' }}
            >
              A
            </span>
            <span className="d-none d-md-block dropdown-toggle ps-2">Admin</span>
          </span>
        </li>
      </ul>
    </nav>
  );
}
