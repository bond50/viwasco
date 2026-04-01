import type { Metadata } from 'next';
import Image from 'next/image';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

import { BillCalculatorForm } from '@/components/public/resources/bill-calculator-form.client';
import styles from '@/components/public/resources/bill-calculator.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Bill Calculator | ${SITE.shortName}`,
    description: 'Estimate your monthly water and sewer charges.',
    path: '/resources/bill-calculator',
    type: 'website',
  });
}

export default async function BillCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Resources', item: '/resources' },
    { name: 'Bill Calculator', item: '/resources/bill-calculator' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Bill Calculator | ${SITE.shortName}`}
        description="Estimate your monthly water and sewer charges."
        path="/resources/bill-calculator"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Bill Calculator" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className="row g-4 align-items-start">
            <BillCalculatorForm />
            <div className="col-lg-4">
              <div className={styles.sideImageCard}>
                <Image
                  src="/assets/img/featured-default.jpg"
                  alt="Water services"
                  width={480}
                  height={520}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
