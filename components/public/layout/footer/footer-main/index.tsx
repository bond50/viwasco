import React from 'react';

import styles from '@/components/public/layout/footer/footer.module.css';
import { FooterLinkList } from '@/components/public/layout/footer/footer-link-list';
import { SocialLinks } from '@/components/reusables/social-links';
import type { ProcessedSocialLink } from '@/lib/social-links';

type LinkItem = {
  text: string;
  url: string;
};

type ContactItem = {
  icon: string;
  text: string;
};

type WorkingHourItem = {
  days: string;
  hours: string;
};

type Props = {
  services: LinkItem[];
  supportLinks: LinkItem[];
  contactInfo: ContactItem[];
  aboutText: string;
  socialLinks: ProcessedSocialLink[];
  ownerName: string;
  workingHours: WorkingHourItem[];
};

export const FooterMain: React.FC<Props> = ({
                                              services,
                                              supportLinks,
                                              contactInfo,
                                              aboutText,
                                              socialLinks,
                                              ownerName,
                                              workingHours,
                                            }) => {
  return (
    <div className={styles.footerMain}>
      <div className="container">
        <div className="row gy-4 align-items-start">
          {/* About / Logo */}
          <div className="col-lg-4 col-md-6 order-1">
            <div className={`${styles.footerWidget} ${styles.footerAbout}`}>
              {aboutText.trim().length > 0 && (
                <p className={styles.footerAboutText}>
                  {aboutText}
                </p>
              )}

              {socialLinks.length > 0 && (
                <div className={styles.footerSocial}>
                  <h4 className={styles.footerWidgetTitle}>Follow us</h4>
                  <SocialLinks
                    links={socialLinks}
                    size="md"
                    ownerName={ownerName}
                    className={styles.footerSocialLinks}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Support links */}
          <div className="col-lg-2 col-md-6 col-sm-6 order-3 order-md-2">
            <div className={styles.footerWidget}>
              <h4 className={styles.footerWidgetTitle}>Support</h4>
              <FooterLinkList links={supportLinks} />
            </div>
          </div>

          {/* Services links */}
          <div className="col-lg-2 col-md-6 col-sm-6 order-4 order-md-3">
            <div className={styles.footerWidget}>
              <h4 className={styles.footerWidgetTitle}>Our Services</h4>
              <FooterLinkList links={services} />
            </div>
          </div>

          {/* Contact info */}
          <div className="col-lg-4 col-md-6 order-2 order-md-4">
            <div className={styles.footerWidget}>
              <h4 className={styles.footerWidgetTitle}>Contact Information</h4>
              {contactInfo.length > 0 ? (
                <div className={styles.footerContact}>
                  {contactInfo.map((item, index) => (
                    <div
                      key={`${item.icon}-${index}`}
                      className={styles.contactItem}
                    >
                      <i
                        className={`bi ${item.icon} ${styles.contactIcon}`}
                        aria-hidden="true"
                      />
                      <span className={styles.contactText}>{item.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Contact details are being updated. Please use the contact page for the latest information.
                </p>
              )}

              {workingHours.length > 0 && (
                <div className={styles.footerHours}>
                  <h5 className={styles.footerHoursTitle}>Working Hours</h5>
                  <ul className={styles.footerHoursList}>
                    {workingHours.map((item) => (
                      <li key={`${item.days}-${item.hours}`} className={styles.footerHoursItem}>
                        <span className={styles.footerHoursDays}>{item.days}</span>
                        <span className={styles.footerHoursValue}>{item.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
