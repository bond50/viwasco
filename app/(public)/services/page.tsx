import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import ServiceCard from '@/components/card/service-card';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { ServicePicker } from '@/components/public/services/service-picker.client';
import styles from '@/components/public/services/services.module.css';
import { getServices } from '@/lib/data/public/services/getters';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { cn } from '@/lib/utils';

type PageProps = {
  searchParams?: Promise<{ page?: string }>;
};

function getServiceCardSummary(summary: string): string {
  const text = summary.trim();
  if (!text) return '';

  const firstSentenceMatch = text.match(/^.*?[.!?](?:\s|$)/);
  const firstSentence = firstSentenceMatch?.[0]?.trim() ?? '';

  if (firstSentence && firstSentence.length <= 120) {
    return firstSentence;
  }

  const shortened = text.slice(0, 120).trim();
  return shortened.length < text.length ? `${shortened}…` : shortened;
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `Services | ${SITE.shortName}`,
    description:
      'Explore our water and sanitation services, including supply, sewer services, and training.',
    path: '/services',
    type: 'website',
  });
}

async function ServicesContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const services = await getServices();
  const pageParam = params.page;
  const pageSize = 6;
  const requestedPage = pageParam ? Number(pageParam) : 1;
  const totalPages = Math.max(1, Math.ceil(services.length / pageSize));
  const safePage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
  );
  const startIndex = (safePage - 1) * pageSize;
  const paginatedServices = services.slice(startIndex, startIndex + pageSize);

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Services', item: '/services' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  const pickerServices = services.map((service) => ({
    id: service.id,
    slug: service.slug,
    name: service.name,
    summary: service.summary,
  }));

  return (
    <>
      <PageSeo
        title={`Services | ${SITE.shortName}`}
        description="Explore our water and sanitation services, including supply, sewer services, and training."
        path="/services"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Services" items={breadcrumbLinks} />

      <Section background="light" padding="lg">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-7">
              <div className={styles.sectionIntro}>
                <h2 className="page-hero-title mb-3">
                  Services for Reliable Water &amp; Sanitation
                </h2>
                <p className="page-hero-text mb-4">
                  Select a service to view details, application guidance, and available forms.
                </p>
              </div>
            </div>

            <div className="col-lg-5">
              <ServicePicker services={pickerServices} />
            </div>
          </div>
        </div>
      </Section>

      <Section padding="lg">
        <div className="container">
          <div className={styles.cardGrid}>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => {
                return (
                  <ServiceCard
                    key={service.id}
                    href={`/services/${service.slug}`}
                    iconKey={service.icon}
                    iconFallback={<MdOutlineSupportAgent aria-hidden="true" />}
                    title={service.name}
                    summary={getServiceCardSummary(service.summary)}
                  />
                );
              })
            ) : (
              <div className="alert alert-info mb-0">No services have been published yet.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Link
                href={safePage > 1 ? `/services?page=${safePage - 1}` : '#'}
                className={cn(styles.pageLink, safePage === 1 && styles.pageLinkDisabled)}
                aria-disabled={safePage === 1}
              >
                Previous
              </Link>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/services?page=${page}`}
                    className={cn(styles.pageNumber, page === safePage && styles.pageNumberActive)}
                  >
                    {page}
                  </Link>
                ))}
              </div>

              <Link
                href={safePage < totalPages ? `/services?page=${safePage + 1}` : '#'}
                className={cn(styles.pageLink, safePage === totalPages && styles.pageLinkDisabled)}
                aria-disabled={safePage === totalPages}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

export default function ServicesPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading services…</div>}>
        <ServicesContent {...props} />
      </Suspense>
    </main>
  );
}
