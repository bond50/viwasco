import Link from 'next/link';
import type { CSSProperties } from 'react';

import { getOrganizationShell } from '@/lib/data/public/about/shell';
import { listServices } from '@/lib/data/admin/services';
import { listProjects } from '@/lib/data/admin/projects';
import { listNews } from '@/lib/data/admin/news';
import { listTenders } from '@/lib/data/admin/tenders';
import { listCareers } from '@/lib/data/admin/careers';
import { listResources } from '@/lib/data/admin/resources';
import { listNewsletters } from '@/lib/data/admin/newsletters';
import { listContactMessages } from '@/lib/data/admin/contact-messages';
import styles from './dashboard.module.css';

const fmt = (value: Date | string) =>
  new Date(value).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const isFilled = (value?: string | null) => Boolean(value && value.trim().length > 0);

export default async function Page() {
  const [org, services, projects, news, tenders, careers, resources, newsletters, messages] =
    await Promise.all([
      getOrganizationShell(),
      listServices(),
      listProjects(),
      listNews(),
      listTenders(),
      listCareers(),
      listResources(),
      listNewsletters(),
      listContactMessages(),
    ]);

  const portalReady = Boolean(org?.customerPortalEnabled && org.customerPortalUrl);
  const contactReady = Boolean(org?.address && org.phone && org.contactEmail);
  const footerReady = isFilled(org?.footerAboutText);
  const serviceCentresReady = (org?.serviceCentres?.length ?? 0) > 0;
  const navReady = org?.navigationVisibility ?? {};

  const cards = [
    {
      label: 'Services',
      value: services.length,
      href: '/dashboard/services',
      note: 'Public service catalogue',
      icon: 'bi-grid-1x2',
      accent: '#4154f1',
      soft: '#eef1ff',
    },
    {
      label: 'Projects',
      value: projects.length,
      href: '/dashboard/projects',
      note: 'Portfolio items',
      icon: 'bi-kanban',
      accent: '#0d9488',
      soft: '#e7f8f5',
    },
    {
      label: 'News',
      value: news.length,
      href: '/dashboard/news',
      note: 'Updates and notices',
      icon: 'bi-newspaper',
      accent: '#f59e0b',
      soft: '#fff6e3',
    },
    {
      label: 'Tenders',
      value: tenders.length,
      href: '/dashboard/tenders',
      note: 'Procurement notices',
      icon: 'bi-file-earmark-text',
      accent: '#0ea5e9',
      soft: '#e8f7ff',
    },
    {
      label: 'Careers',
      value: careers.length,
      href: '/dashboard/careers',
      note: 'Vacancies and types',
      icon: 'bi-briefcase',
      accent: '#dc2626',
      soft: '#fdecec',
    },
    {
      label: 'Resources',
      value: resources.length,
      href: '/dashboard/resources',
      note: 'Kinds and downloads',
      icon: 'bi-folder2-open',
      accent: '#7c3aed',
      soft: '#f2ecff',
    },
    {
      label: 'Newsletters',
      value: newsletters.length,
      href: '/dashboard/newsletters',
      note: 'Newsletter issues',
      icon: 'bi-envelope-paper',
      accent: '#16a34a',
      soft: '#eaf8ef',
    },
    {
      label: 'Messages',
      value: messages.length,
      href: '/dashboard/contact-messages',
      note: 'Inbox records',
      icon: 'bi-chat-square-text',
      accent: '#334155',
      soft: '#edf2f7',
    },
  ];

  const statStyle = (accent: string, soft: string): CSSProperties =>
    ({ '--stat-accent': accent, '--stat-soft': soft }) as CSSProperties;

  const recentItems = [
    ...news.slice(0, 3).map((item) => ({
      label: item.title,
      meta: `News · ${item.category}`,
      href: '/dashboard/news',
      when: fmt(item.updated_at),
    })),
    ...projects.slice(0, 2).map((item) => ({
      label: item.title,
      meta: `Project · ${item.status}`,
      href: '/dashboard/projects',
      when: fmt(item.updated_at),
    })),
    ...messages.slice(0, 2).map((item) => ({
      label: item.subject,
      meta: `Contact · ${item.full_name}`,
      href: '/dashboard/contact-messages',
      when: fmt(item.created_at),
    })),
  ].slice(0, 6);

  const readinessItems = [
    { label: 'Contact details complete', ok: contactReady },
    { label: 'Footer about text present', ok: footerReady },
    { label: 'Customer portal ready', ok: portalReady },
    { label: 'Service centres configured', ok: serviceCentresReady },
    { label: 'News visible in header', ok: navReady.news ?? true },
    { label: 'Newsletters nested under News & Updates', ok: navReady.newsletters ?? true },
  ];

  return (
    <div className={styles.shell}>
      <div className="card border-0 shadow-sm">
        <div className={styles.heroCard}>
          <div className={styles.heroBody}>
            <div>
              <div className={styles.eyebrow}>
                <i className="bi bi-speedometer2" aria-hidden="true" />
                Dashboard
              </div>
              <h1 className={styles.heroTitle}>Content overview</h1>
              <p className={styles.heroLead}>
                Use this page to see what is live, what needs attention, and where to add new
                content without hunting through the sidebar.
              </p>
            </div>
            <div className={styles.heroActions}>
              <Link href="/dashboard/content-guide" className="btn btn-light btn-sm">
                Open content guide
              </Link>
              <Link
                href="/dashboard/about/organization"
                className={`btn btn-outline-light btn-sm ${styles.heroSecondary}`}
              >
                Edit organization settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statGrid}>
        {cards.map((card) => (
          <div
            className="card h-100 border-0 shadow-sm"
            key={card.label}
            style={statStyle(card.accent, card.soft)}
          >
            <div className={styles.statCard}>
              <div className={styles.statBody}>
                <div className={styles.statTop}>
                  <div>
                    <p className={styles.statLabel}>{card.label}</p>
                    <p className={styles.statValue}>{card.value}</p>
                  </div>
                  <span className={styles.statIcon}>
                    <i className={`bi ${card.icon}`} aria-hidden="true" />
                  </span>
                </div>
                <p className={styles.statNote}>{card.note}</p>
                <Link
                  href={card.href}
                  className={`link-primary text-decoration-none ${styles.statLink}`}
                >
                  Manage {card.label.toLowerCase()}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card h-100 border-0 shadow-sm">
            <div className={styles.panelCard}>
              <div className="card-body">
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelKicker}>Public readiness</p>
                    <h2 className={styles.panelTitle}>What is safe to publish</h2>
                    <p className={styles.panelLead}>
                      These checks help prevent empty shells, broken links, and missing contact
                      information.
                    </p>
                  </div>
                </div>
                <div className={styles.statusGrid}>
                  {readinessItems.map((item) => (
                    <div key={item.label} className={styles.statusRow}>
                      <span className={styles.statusLabel}>{item.label}</span>
                      <span
                        className={`${styles.statusBadge} ${item.ok ? styles.statusReady : styles.statusCheck}`}
                      >
                        {item.ok ? 'Ready' : 'Check'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card h-100 border-0 shadow-sm">
            <div className={styles.panelCard}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                  <div>
                    <p className={styles.panelKicker}>Recent activity</p>
                    <h2 className={styles.panelTitle}>Latest changes</h2>
                  </div>
                  <Link href="/dashboard/news" className="small text-decoration-none">
                    View news
                  </Link>
                </div>
                <div className="list-group list-group-flush">
                  {recentItems.length > 0 ? (
                    recentItems.map((item) => (
                      <Link
                        key={`${item.meta}-${item.label}`}
                        href={item.href}
                        className="list-group-item list-group-item-action px-0"
                      >
                        <div className="d-flex justify-content-between gap-3">
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                              {item.label}
                            </div>
                            <div className="text-muted small" style={{ lineHeight: 1.45 }}>
                              {item.meta}
                            </div>
                          </div>
                          <div
                            className="text-muted small text-nowrap"
                            style={{ fontSize: '0.8rem' }}
                          >
                            {item.when}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="list-group-item px-0 text-muted">No recent content yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className={styles.panelCard}>
              <div className="card-body">
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelKicker}>Recommended next actions</p>
                    <h2 className={styles.panelTitle}>Keep the site stable</h2>
                  </div>
                </div>
                <ul className={styles.rulesList}>
                  <li>Update organization settings before touching public content.</li>
                  <li>Use the guide page if you want the quickest route to the right section.</li>
                  <li>Check contact messages daily so nothing sits unanswered.</li>
                  <li>Publish news before newsletters if both are going live the same day.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className={styles.panelCard}>
              <div className="card-body">
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelKicker}>Shortcuts</p>
                    <h2 className={styles.panelTitle}>Create something new</h2>
                  </div>
                </div>
                <div className={styles.actionGrid}>
                  {[
                    ['New service', '/dashboard/services/new'],
                    ['New project', '/dashboard/projects/new'],
                    ['New news item', '/dashboard/news/new'],
                    ['New tender', '/dashboard/tenders/new'],
                    ['New career', '/dashboard/careers/new'],
                    ['New resource', '/dashboard/resources/new'],
                  ].map(([label, href]) => (
                    <Link key={href} href={href} className="btn btn-outline-primary text-start">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
