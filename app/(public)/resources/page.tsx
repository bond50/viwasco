import type { Metadata } from 'next';
import Link from 'next/link';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { getResourceSections } from '@/lib/data/public/resources/getters';
import styles from '@/components/public/services/services.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Resources | ${SITE.shortName}`,
    description: 'Helpful tools, reports, tariffs, and notices for customers.',
    path: '/resources',
    type: 'website',
  });
}

export default async function ResourcesPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Resources', item: '/resources' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);
  const sections = await getResourceSections();

  return (
    <main>
      <PageSeo
        title={`Resources | ${SITE.shortName}`}
        description="Helpful tools, reports, tariffs, and notices for customers."
        path="/resources"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Resources" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className={styles.cardGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceTitle}>Bill Calculator</div>
              <p className="text-muted">
                Estimate monthly water and sewer charges based on usage and meter size.
              </p>
              <Link className={styles.serviceLink} href="/resources/bill-calculator">
                Open calculator →
              </Link>
            </div>

            {sections.map((section) => (
              <div key={section.id} className={styles.serviceCard}>
                <div className={styles.serviceTitle}>{section.name}</div>
                <p className="text-muted">{section.summary}</p>
                <Link className={styles.serviceLink} href={`/resources/${section.slug}`}>
                  View details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
