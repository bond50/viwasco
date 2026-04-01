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
import { RichContent } from '@/components/reusables/rich-text/HtmlContent';

import { getNewsletterBySlug } from '@/lib/data/public/newsletters/getters';
import styles from '@/components/public/news/news.module.css';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsletterBySlug(slug);

  if (!item) {
    return generatePageMetadata({
      title: `Newsletter Not Found | ${SITE.shortName}`,
      description: 'The requested newsletter was not found.',
      path: `/newsletters/${slug}`,
      type: 'website',
    });
  }

  return generatePageMetadata({
    title: `${item.title} | Newsletters | ${SITE.shortName}`,
    description: item.excerpt,
    path: `/newsletters/${item.slug}`,
    image: item.heroImage,
    type: 'website',
  });
}

async function NewsletterDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsletterBySlug(slug);

  if (!item) return notFound();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Newsletters', item: '/newsletters' },
    { name: item.title, item: `/newsletters/${item.slug}` },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <>
      <PageSeo
        title={`${item.title} | Newsletters | ${SITE.shortName}`}
        description={item.excerpt}
        path={`/newsletters/${item.slug}`}
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle={item.title} items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <div className={styles.detailHero}>
                <Image
                  src={item.heroImage || '/assets/img/featured-default.jpg'}
                  alt={item.title}
                  width={640}
                  height={520}
                  className="img-fluid"
                  priority
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className={styles.cardMeta}>
                <span className={styles.badge}>Newsletter</span>
                <span>{item.publishedAt}</span>
              </div>
              <h1 className={styles.detailTitle}>{item.title}</h1>
              <RichContent html={item.content} />

              <div className={styles.newsletterPreview}>
                <iframe src={item.pdfUrl} title={`${item.title} preview`} />
              </div>

              <div className={styles.newsletterFooter}>
                <div className={styles.newsletterMeta}>
                  <span>Date added: {item.publishedAt}</span>
                  <span>Downloads: {item.downloads.toLocaleString()}</span>
                  <span>Size: {item.sizeMb.toFixed(1)} MB</span>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Link href="/newsletters" className="btn btn-outline-primary">
                    Back to Newsletters
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

export default function NewsletterDetailPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading newsletter…</div>}>
        <NewsletterDetailContent {...props} />
      </Suspense>
    </main>
  );
}
