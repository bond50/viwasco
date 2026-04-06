import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MdOutlineSupportAgent } from 'react-icons/md';

import ServiceCard from '@/components/card/service-card';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import SectionTitle2 from '@/components/reusables/sections/section-title-2';
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

function getServiceLabel(slug: string): string {
  const labelMap: Record<string, string> = {
    'new-water-connection': 'Customer Service',
    'water-supply': 'Utility Service',
    'sewer-services': 'Sanitation Service',
    'water-bower-services': 'Emergency Support',
    'exhauster-services': 'Sanitation Support',
    'water-quality-training': 'Capacity Building',
  };

  return labelMap[slug] ?? 'Customer Service';
}

function normalizeTextContent(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeServiceBodyHtml(html: string): string {
  let nextHtml = html.replace(/<p\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');

  const paragraphMatches = Array.from(nextHtml.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi));
  if (paragraphMatches.length >= 2) {
    const firstParagraph = normalizeTextContent(paragraphMatches[0][0]);
    const secondParagraph = normalizeTextContent(paragraphMatches[1][0]);

    if (firstParagraph && firstParagraph === secondParagraph) {
      nextHtml = nextHtml.replace(paragraphMatches[1][0], '');
    }
  }

  const seenIds = new Set<string>();

  nextHtml = nextHtml.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, level, attrs, content) => {
    const label = normalizeTextContent(content);
    if (!label) return `<h${level}${attrs}>${content}</h${level}>`;

    let id = slugifyHeading(label) || `section-${seenIds.size + 1}`;
    const baseId = id;
    let suffix = 2;
    while (seenIds.has(id)) {
      id = `${baseId}-${suffix++}`;
    }
    seenIds.add(id);

    const cleanedAttrs = /\sid=/i.test(attrs)
      ? attrs.replace(/\sid=(["']).*?\1/i, '')
      : attrs;

    return `<h${level}${cleanedAttrs} id="${id}">${content}</h${level}>`;
  });

  return nextHtml;
}

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
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  const heroSrc =
    service.heroImage?.variants?.large?.secure_url ||
    service.heroImage?.variants?.medium?.secure_url ||
    service.heroImage?.variants?.small?.secure_url ||
    service.heroImage?.main.secure_url ||
    '/assets/img/featured-default.jpg';

  const heroWidth = service.heroImage?.main.width ?? 640;
  const heroHeight = service.heroImage?.main.height ?? 520;
  const serviceLabel = getServiceLabel(service.slug);
  const normalizedBody = normalizeServiceBodyHtml(service.bodyHtml);

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
              <SectionTitle2
                title="Explore Our Services"
                subtitle="Switch services to compare requirements, application guidance, and available support."
                align="left"
                underline
                size="md"
                className={styles.sectionIntroTitle}
              />
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
                <div className={styles.detailEyebrow}>{serviceLabel}</div>
                <h1>{service.name}</h1>

                <div id="service-overview" />
                <RichContent
                  html={normalizedBody}
                  className={styles.serviceRichContent}
                  imageSizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 80vw,
                             900px"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {relatedServices.length ? (
        <Section background="light" padding="lg" className={styles.relatedSection}>
          <div className="container">
            <SectionTitle2
              title="Related Services"
              subtitle="Explore other support options and customer service pathways."
              align="center"
              underline
              size="sm"
              className={styles.relatedSectionHeader}
            />

            <div className={styles.cardGrid}>
              {relatedServices.map((item) => (
                <ServiceCard
                  key={item.id}
                  href={`/services/${item.slug}`}
                  iconKey={item.icon}
                  iconFallback={<MdOutlineSupportAgent aria-hidden="true" />}
                  title={item.name}
                  summary={item.summary}
                />
              ))}
            </div>
          </div>
        </Section>
      ) : null}
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
