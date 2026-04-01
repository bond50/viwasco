import React from 'react';
import styles from '@/components/public/layout/footer/footer.module.css';

type Props = {
  year: number;
  companyLabel: string;
};

export const FooterBottom: React.FC<Props> = ({ year, companyLabel }) => {
  return (
    <div className={styles.footerBottom}>
      <div className="container">
        <div className="row gy-3 align-items-center justify-content-center">
          <div className="col-lg-12">
            <div className={styles.copyright}>
              <p>
                © Copyright{' '}
                <strong className={styles.sitename}>
                  {year} {companyLabel}
                </strong>
                . All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
