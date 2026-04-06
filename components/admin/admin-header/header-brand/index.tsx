import { pickImageUrl } from '@/lib/public/media';
import { getOrganizationShell } from '@/lib/data/public/about/shell';
import Link from 'next/link';
import Image from 'next/image';

export async function HeaderBrand() {
  const org = await getOrganizationShell();
  const logo = org ? pickImageUrl(org.logo) : null;
  const name = org?.shortName || org?.name || 'Admin';

  return (
    <div className="d-flex align-items-center justify-content-between">
      <Link href="/admin" className="logo d-flex align-items-center text-decoration-none">
        {logo ? (
          <Image
            src={logo}
            alt={`${name} logo`}
            width={505}
            height={494}
            priority
            style={{ height: 'var(--admin-logo-height)', width: 'auto', objectFit: 'contain' }}
          />
        ) : (
          <span className="d-none d-lg-block">{name}</span>
        )}
        {logo && <span className="d-none d-lg-block ms-2">{name}</span>}
      </Link>

      {/* AdminBehaviors watches for clicks on .toggle-sidebar-btn */}
      <button
        type="button"
        className="btn p-0 border-0 bg-transparent toggle-sidebar-btn"
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list" aria-hidden="true" />
      </button>
    </div>
  );
}
