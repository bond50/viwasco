import type { Metadata } from 'next';
import { getCertifications } from '@/lib/data/public/about/getters';
import { CertsList } from '@/components/public/about/cert-list';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Certifications | ${SITE.shortName}`;
  const description = 'Corporate certifications and compliance credentials for the utility.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/certifications',
    type: 'website',
  });
}

export default async function CertificationsPage() {
  const certs = await getCertifications();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Certifications', item: '/about/certifications' },
  ];

  return (
    <main>
      <PageSeo
        title={`Certifications | ${SITE.shortName}`}
        description="Corporate certifications and compliance credentials for the utility."
        path="/about/certifications"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Certifications" items={toUiBreadcrumbs(breadcrumbItems)} />

      <CertsList items={certs} />
    </main>
  );
}
