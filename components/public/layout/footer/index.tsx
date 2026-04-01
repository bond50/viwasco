import React from 'react';
import { FiArrowUp } from 'react-icons/fi';
import styles from '@/components/public/layout/footer/footer.module.css';
import { getOrganizationShell } from '@/lib/data/public/about/shell';
import { fetchAboutForNav } from '@/lib/data/public/about/fetch-about-for-nav';
import { getServices } from '@/lib/data/public/services/getters';
import { FooterMain } from '@/components/public/layout/footer/footer-main';
import { FooterBottom } from '@/components/public/layout/footer/footer-bottom';
import Image from 'next/image';

export const Footer = async () => {
  const [org, serviceRows, aboutNav] = await Promise.all([
    getOrganizationShell(),
    getServices(),
    fetchAboutForNav(),
  ]);

  const services = serviceRows.map((service) => ({
    text: service.name,
    url: `/services/${service.slug}`,
  }));

  const supportLinks = [
    { text: 'Contact Form', url: '/contact#contact-form' },
    ...(org?.serviceCentres?.length
      ? [{ text: 'Service Centres', url: '/contact#service-centres' }]
      : []),
    ...(org?.customerPortalEnabled && org.customerPortalUrl
      ? [{ text: 'Customer Portal', url: '/contact#customer-portal' }]
      : []),
    ...(aboutNav.hasFaqs ? [{ text: 'FAQs', url: '/about/faqs' }] : []),
  ];

  const aboutText =
    (org?.footerAboutText && org.footerAboutText.trim()) ||
    (org?.introDescription && org.introDescription.trim()) ||
    (org?.description && org.description.trim()) ||
    '';

  const contactInfo = [
    ...(org?.contactDetails ?? []),
  ]
    .filter((item) => Boolean(item.value && item.value.trim().length > 0))
    .map((item) => ({
      icon:
        item.kind === 'address'
          ? 'bi-geo-alt'
          : item.kind === 'phone'
            ? 'bi-telephone'
            : item.kind === 'email'
              ? 'bi-envelope'
              : 'bi-clock',
      text: item.value as string,
    }));

  const year = 2026;
  const companyLabel = org?.shortName ?? org?.name ?? 'VIWASCO';
  const socialLinks = org?.socialLinks ?? [];

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerImages} ${styles.footerTopRight}`}>
        <Image
          src="/assets/img/figures/figure2.png"
          alt="Decorative element"
          width={369}
          height={225}
          loading="lazy"
          className={styles.footerImage}
        />
      </div>

      <FooterMain
        services={services}
        supportLinks={supportLinks}
        contactInfo={contactInfo}
        aboutText={aboutText}
        socialLinks={socialLinks}
        ownerName={companyLabel}
        workingHours={org?.workingHours ?? []}
      />

      <FooterBottom
        year={year}
        companyLabel={companyLabel}
      />

      <a href="#top" className={styles.backToTop} aria-label="Back to top">
        <FiArrowUp />
      </a>

      <div className={`${styles.footerImages} ${styles.footerBottomLeft}`}>
        <Image
          src="/assets/img/figures/figure1.png"
          alt="Decorative element"
          width={309}
          height={329}
          loading="lazy"
          className={styles.footerImage}
        />
      </div>
    </footer>
  );
};
