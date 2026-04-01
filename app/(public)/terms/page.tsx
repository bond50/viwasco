import type { Metadata } from 'next';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Terms & Conditions | ${SITE.shortName}`,
    description: 'Terms and conditions for customer enquiries and complaints.',
    path: '/terms',
    type: 'website',
  });
}

export default async function TermsPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Terms & Conditions', item: '/terms' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Terms & Conditions | ${SITE.shortName}`}
        description="Terms and conditions for customer enquiries and complaints."
        path="/terms"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Terms & Conditions" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="mb-3">Terms & Conditions</h2>
              <p className="text-muted">
                By submitting this form, you confirm that the information provided is accurate and
                you consent to being contacted for follow-up. Personal data is handled in line with
                applicable privacy requirements.
              </p>
              <ul className="text-muted">
                <li>Use the contact form for official service enquiries and complaints only.</li>
                <li>Provide correct contact information to receive updates.</li>
                <li>Submitting false information may delay service response.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
