// components/layout/topbar.tsx (or wherever your TopBar lives)
import Link from 'next/link';
import { BsClock, BsEnvelopeFill, BsTelephoneFill } from 'react-icons/bs';

import styles from './topbar.module.css';

import { getOrganizationShell } from '@/lib/data/public/about/shell';
import { SocialLinks } from '@/components/reusables/social-links';

export async function TopBar() {
  const org = await getOrganizationShell();

  const email = org?.contactEmail || '';
  const phone = org?.phone || org?.customerCareHotline || '';
  const hoursLabel = org?.workingHoursLabel || '';
  const socials = org?.socialLinks ?? [];

  const orgName = org?.shortName || org?.name || 'Organization';

  return (
    <div data-topbar className={`${styles.topbar} d-flex align-items-center`}>
      <div className="container d-flex justify-content-between align-items-center">
        {/* LEFT: Contacts */}
        <div className={`${styles['contact-info']} d-flex align-items-center`}>
          {email && (
            <span className={styles.iconWrap}>
              <BsEnvelopeFill size={12} />
              <Link href={`mailto:${email}`}>{email}</Link>
            </span>
          )}

          {phone && (
            <span className={styles.iconWrap}>
              <BsTelephoneFill size={12} />
              <span>{phone}</span>
            </span>
          )}

          {hoursLabel && (
            <span className={styles.hours}>
              <BsClock size={12} />
              <span>{hoursLabel}</span>
            </span>
          )}
        </div>

        {/* RIGHT: Social links */}
        {socials.length > 0 && (
          <SocialLinks
            links={socials}
            size="sm"
            variant="topbar"
            ownerName={orgName}
            className={`${styles['social-links']} d-none d-md-flex align-items-center`}
          />
        )}


      </div>
    </div>
  );
}
