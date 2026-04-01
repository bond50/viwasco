import Link from 'next/link';
import type { CSSProperties } from 'react';

import styles from '../dashboard.module.css';

const sections = [
  {
    title: 'Start here',
    badge: 'Recommended flow',
    accent: '#4154f1',
    items: [
      'Set organization contact details, footer text, portal state, and header visibility first.',
      'Update About & Profile content next, because it drives the public identity and navigation.',
      'Then publish Services, Projects, News, Resources, Tenders, Careers, and Newsletters.',
      'Use the QA checks before publishing anything customer-facing.',
    ],
  },
  {
    title: 'About & Profile',
    badge: 'Identity',
    accent: '#0d9488',
    items: [
      'Company Settings: organization name, logo, hero/banner, contact data, footer copy, portal toggle.',
      'Awards, Certifications, FAQs, Milestones, Testimonials, Core Values, Metrics, Leadership, Partners.',
      'Use this section for corporate profile content, not service or notice content.',
    ],
  },
  {
    title: 'Services',
    badge: 'Service delivery',
    accent: '#f59e0b',
    items: [
      'Create one service per real service offering.',
      'Title generates the slug automatically.',
      'Excerpt is auto-generated from the rich text body.',
      'No category is needed. Keep the content focused on the service itself.',
    ],
  },
  {
    title: 'Projects',
    badge: 'Projects',
    accent: '#7c3aed',
    items: [
      'Use the rich text content field for the project narrative.',
      'Short description is auto-generated from the body.',
      'Project status is controlled by the enum: ongoing or completed.',
      'Keep public-facing appearance unchanged; only the data source is database-driven.',
    ],
  },
  {
    title: 'News & Updates',
    badge: 'Editorial',
    accent: '#dc2626',
    items: [
      'News items are for public updates, notices, and articles.',
      'Newsletters live inside the News & Updates dropdown on the public site.',
      'Use the article body for the full story and the excerpt for the summary.',
      'Publish with a hero image and a meaningful category.',
    ],
  },
  {
    title: 'Resources',
    badge: 'Downloads',
    accent: '#16a34a',
    items: [
      'Bill Calculator stays static and does not need admin data entry.',
      'Resource kinds and categories help organize files and public sections.',
      'Upload files through the file picker instead of asking users for URLs.',
      'Use this for reports, tariffs, notices, strategic plans, and similar documents.',
    ],
  },
  {
    title: 'Tenders',
    badge: 'Procurement',
    accent: '#0ea5e9',
    items: [
      'Tender status uses the enum: Open, Awarded, Archived.',
      'Upload the tender file and keep the summary concise.',
      'Use this area for procurement notices and download links only.',
    ],
  },
  {
    title: 'Careers',
    badge: 'Vacancies',
    accent: '#334155',
    items: [
      'Career types are taxonomies, such as Full-time or Contract.',
      'Attach the application PDF/file and keep the description short.',
      'Closing date is optional but should be set when known.',
    ],
  },
  {
    title: 'Contact & access',
    badge: 'Public support',
    accent: '#4154f1',
    items: [
      'Update head office address, telephone, email, footer copy, and service centres here.',
      'Use the portal toggle carefully: only enable it when the URL is live.',
      'Use the navigation visibility toggles to hide top-level links that are not ready.',
      'Run the content QA panel before publishing changes.',
    ],
  },
];

const quickLinks = [
  { label: 'Organization settings', href: '/dashboard/about/organization' },
  { label: 'Services', href: '/dashboard/services' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'News', href: '/dashboard/news' },
  { label: 'Newsletters', href: '/dashboard/newsletters' },
  { label: 'Resources', href: '/dashboard/resources' },
  { label: 'Tenders', href: '/dashboard/tenders' },
  { label: 'Careers', href: '/dashboard/careers' },
  { label: 'Contact messages', href: '/dashboard/contact-messages' },
];

export default function ContentGuidePage() {
  const sectionStyle = (accent: string): CSSProperties =>
    ({ '--section-accent': accent }) as CSSProperties;

  return (
    <div className={styles.shell}>
      <div className="card border-0 shadow-sm">
        <div className={`${styles.heroCard} ${styles.guideHero}`}>
          <div className={styles.heroBody}>
            <div>
              <div className={styles.eyebrow}>
                <i className="bi bi-journal-text" aria-hidden="true" />
                Admin guide
              </div>
              <h1 className={styles.heroTitle}>Content Guide</h1>
              <p className={styles.heroLead} style={{ maxWidth: 820 }}>
                Use this page as the operating map for the CMS. It tells you what belongs where,
                which fields are auto-generated, and where to edit public-facing content without
                training overhead.
              </p>
              <div className={styles.pillRow}>
                <span className={styles.pill}>Database driven</span>
                <span className={styles.pill}>Public site stays stable</span>
                <span className={styles.pill}>Use QA before publish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className={styles.quickLinkCard}>
              <div className="card-body">
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelKicker}>Quick links</p>
                    <h2 className={styles.panelTitle}>Jump to a section</h2>
                  </div>
                </div>
                <div className={styles.quickLinkList}>
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.quickLink}>
                      <span>{link.label}</span>
                      <i
                        className={`bi bi-chevron-right ${styles.quickLinkIcon}`}
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card h-100 border-0 shadow-sm">
            <div className={styles.rulesCard}>
              <div className="card-body">
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelKicker}>Important rules</p>
                    <h2 className={styles.panelTitle}>What to follow every time</h2>
                  </div>
                </div>
                <div className="alert alert-info mb-0 py-3">
                  <ul className={`${styles.rulesList} mb-0`}>
                    <li>
                      Use the organization settings tab for public contact, footer, and portal
                      controls.
                    </li>
                    <li>
                      Use the rich text editor for content-heavy modules like services, projects,
                      and news.
                    </li>
                    <li>Use file upload fields for tenders, careers, resources, and documents.</li>
                    <li>
                      Keep slugs, excerpts, publish controls, and auto-generated fields on autopilot
                      where the app already does that.
                    </li>
                    <li>
                      For anything hidden on the public site, use the visibility controls instead of
                      deleting the record unless the content is truly obsolete.
                    </li>
                    <li>
                      Use the{' '}
                      <Link
                        href="/dashboard/about/organization?section=communications&tab=comm-contact"
                        className="fw-semibold text-decoration-none"
                      >
                        QA panel in Organization settings
                      </Link>{' '}
                      before publishing changes.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {sections.map((section) => (
          <div className="col-lg-6" key={section.title}>
            <div className="card h-100 border-0 shadow-sm" style={sectionStyle(section.accent)}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionBody}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <span className={styles.sectionBadge}>{section.badge}</span>
                  </div>
                  <ul className={styles.sectionList}>
                    {section.items.map((item) => (
                      <li key={item} className="mb-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
