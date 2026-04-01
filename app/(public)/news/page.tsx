import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { getNewsCategories, getNewsItems } from '@/lib/data/public/news/getters';
import styles from '@/components/public/news/news.module.css';

type PageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const [categories, items] = await Promise.all([
    getNewsCategories(),
    getNewsItems(params.category),
  ]);

  const categoryLabel = params.category
    ? categories.find((item) => item.slug === params.category)?.label
    : null;
  const item = items[0];
  const title = categoryLabel
    ? `${categoryLabel} News | ${SITE.shortName}`
    : `News | ${SITE.shortName}`;
  const description = item?.excerpt || 'Updates, notices, and customer communications.';

  return generatePageMetadata({
    title,
    description,
    path: '/news',
    image: item?.heroImage,
    type: 'website',
  });
}

async function NewsContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const [categories, items] = await Promise.all([
    getNewsCategories(),
    getNewsItems(params.category),
  ]);

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'News', item: '/news' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);
  const seoItems = items.slice(0, 8).map((item, index) => ({
    name: item.title,
    url: `/news/${item.slug}`,
    position: index + 1,
  }));

  return (
    <>
      <PageSeo
        title={`News | ${SITE.shortName}`}
        description={items[0]?.excerpt || 'Updates, notices, and customer communications.'}
        path="/news"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={{
          name: 'News updates',
          description: 'Latest notices, updates, and customer communications from the utility.',
          url: '/news',
          items: seoItems,
        }}
      />

      <Breadcrumb pageTitle="News" items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          {categories.length > 0 && (
            <div className={styles.filterRow}>
              <Link
                href="/news"
                className={`${styles.filterChip} ${!params.category ? styles.filterChipActive : ''}`}
              >
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news?category=${item.slug}`}
                  className={`${styles.filterChip} ${params.category === item.slug ? styles.filterChipActive : ''}`}
                >
                  {item.label}
                  <span className={styles.filterCount}>{item.count}</span>
                </Link>
              ))}
            </div>
          )}

          <div className={styles.newsGrid}>
            {items.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className={styles.newsCard}>
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  width={640}
                  height={420}
                  className={styles.cardImage}
                />
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.badge}>{item.category}</span>
                    <span>
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString('en-KE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                  <div className={styles.cardTitle}>{item.title}</div>
                  <p className="text-muted mb-0">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          {items.length === 0 && (
            <div className="alert alert-info mt-4">No news items have been published yet.</div>
          )}
        </div>
      </Section>
    </>
  );
}

export default function NewsPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading news…</div>}>
        <NewsContent {...props} />
      </Suspense>
    </main>
  );
}
