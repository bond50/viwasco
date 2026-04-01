import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

import { ServicePicker } from '@/components/public/services/service-picker.client';
import { RichContent } from '@/components/reusables/rich-text/HtmlContent';
import styles from '@/components/public/services/services.module.css';
import { getServiceBySlug, getServices } from '@/lib/data/public/services/getters';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return generatePageMetadata({
      title: `Service Not Found | ${SITE.shortName}`,
      description: 'The requested service was not found.',
      path: `/services/${slug}`,
      type: 'website',
    });
  }

  return generatePageMetadata({
    title: `${service.name} | Services | ${SITE.shortName}`,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: service.heroImage?.main.secure_url ?? '/assets/img/featured-default.jpg',
    type: 'website',
  });
}

async function ServiceDetailContent({ params }: PageProps) {
  const { slug } = await params;

  const [service, services] = await Promise.all([getServiceBySlug(slug), getServices()]);

  if (!service) return notFound();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Services', item: '/services' },
    { name: service.name, item: `/services/${service.slug}` },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  const pickerServices = services.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    summary: item.summary,
  }));

  const heroSrc =
    service.heroImage?.variants?.large?.secure_url ||
    service.heroImage?.variants?.medium?.secure_url ||
    service.heroImage?.variants?.small?.secure_url ||
    service.heroImage?.main.secure_url ||
    '/assets/img/featured-default.jpg';

  const heroWidth = service.heroImage?.main.width ?? 640;
  const heroHeight = service.heroImage?.main.height ?? 520;

  return (
    <>
      <PageSeo
        title={`${service.name} | Services | ${SITE.shortName}`}
        description={service.summary}
        path={`/services/${service.slug}`}
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle={service.name} items={breadcrumbLinks} />

      <Section background="light" padding="lg">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-7">
              <div className={styles.sectionIntro}>
                <h2 className="mb-3">Explore Our Services</h2>
                <p className="text-muted mb-4">Pick another service to view the full details.</p>
              </div>
            </div>

            <div className="col-lg-5">
              <ServicePicker services={pickerServices} selectedSlug={service.slug} />
            </div>
          </div>
        </div>
      </Section>

      <Section padding="lg">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <div className={styles.detailHero}>
                <Image
                  src={heroSrc}
                  alt={`${service.name} hero`}
                  width={heroWidth}
                  height={heroHeight}
                  className="img-fluid"
                  priority
                />
              </div>
            </div>

            <div className="col-lg-7">
              <div className={styles.detailContent}>
                <h1>{service.name}</h1>

                {service.summary ? <p className="text-muted mb-4">{service.summary}</p> : null}

                <RichContent
                  html={service.bodyHtml}
                  imageSizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 80vw,
                             900px"
                />

                <div className={styles.actionRow}>
                  <Link href="/contact" className="btn-accent">
                    Apply
                  </Link>
                  <Link href="/about/documents" className="btn-outline-accent">
                    Download Form
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function ServiceDetailPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading service…</div>}>
        <ServiceDetailContent {...props} />
      </Suspense>
    </main>
  );
}
