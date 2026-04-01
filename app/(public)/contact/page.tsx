import type { Metadata } from 'next';
import Link from 'next/link';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { ContactFormCard } from '@/components/public/contact/contact-form.client';
import { getOrganizationShell } from '@/lib/data/public/about/shell';
import styles from '@/components/public/contact/contact.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Contact Us | ${SITE.shortName}`,
    description: 'Get in touch with our team for enquiries, complaints, and support.',
    path: '/contact',
    type: 'website',
  });
}

function renderValue(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : 'Not provided yet';
}

export default async function ContactPage() {
  const org = await getOrganizationShell();
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);
  const serviceCentres = org?.serviceCentres ?? [];
  const workingHours = org?.workingHours ?? [];
  const portalEnabled = Boolean(org?.customerPortalEnabled && org.customerPortalUrl);
  const portalLabel =
    (org?.customerPortalLabel && org.customerPortalLabel.trim()) || 'Customer Portal';

  return (
    <main>
      <PageSeo
        title={`Contact Us | ${SITE.shortName}`}
        description="Get in touch with our team for enquiries, complaints, and support."
        path="/contact"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Contact" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className={styles.contactWrap}>
                <div id="head-office" className={styles.infoCard}>
                  <div className={styles.infoTitle}>Head Office</div>
                  <div className={styles.infoList}>
                    {org?.contactDetails.map((detail) => (
                      <div key={detail.kind} className={styles.infoItem}>
                        <strong>{detail.label}</strong>
                        <span>{renderValue(detail.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {workingHours.length > 0 && (
                  <div id="working-hours" className={styles.infoCard}>
                    <div className={styles.infoTitle}>Working Hours</div>
                    <div className={styles.hoursList}>
                      {workingHours.map((item) => (
                        <div key={`${item.days}-${item.hours}`} className={styles.hoursItem}>
                          <span className={styles.hoursDays}>{item.days}</span>
                          <span className={styles.hoursValue}>{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div id="customer-portal" className={styles.infoCard}>
                  <div className={styles.infoTitle}>{portalLabel}</div>
                  {portalEnabled ? (
                    <>
                      <p className="text-muted mb-3">
                        Access customer self-service, account details, and online support.
                      </p>
                      <div className={styles.portalCTA}>
                        <Link
                          href={org!.customerPortalUrl!}
                          className={styles.portalLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open portal
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted mb-0">
                      The customer portal is currently disabled. Please use the contact form or call
                      the office for help.
                    </p>
                  )}
                </div>

                <div id="service-centres" className={styles.infoCard}>
                  <div className={styles.infoTitle}>Service Centres</div>
                  {serviceCentres.length > 0 ? (
                    <div className={styles.infoList}>
                      {serviceCentres.map((centre) => (
                        <div key={`${centre.name}-${centre.address}`} className={styles.infoItem}>
                          <strong>{centre.name}</strong>
                          <span>{centre.address}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-secondary mb-0">
                      Service centres have not been configured yet. Please contact the head office
                      below.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div id="contact-form" className="col-lg-8">
              <ContactFormCard />
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
