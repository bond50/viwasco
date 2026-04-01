import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { RichContent } from '@/components/reusables/rich-text/HtmlContent';
import { htmlToExcerpt } from '@/lib/text/excerpt';
import { absUrl } from '@/lib/seo/origin.server';
import { getLatestNews, getNewsBySlug, getNewsCategories } from '@/lib/data/public/news/getters';
import styles from '@/components/public/news/news.module.css';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return generatePageMetadata({
      title: `News Not Found | ${SITE.shortName}`,
      description: 'The requested news item was not found.',
      path: `/news/${slug}`,
      type: 'website',
    });
  }

  const description =
    item.excerpt || htmlToExcerpt(item.content, 160) || 'News update from the utility.';

  return generatePageMetadata({
    title: `${item.title} | News | ${SITE.shortName}`,
    description,
    path: `/news/${item.slug}`,
    image: item.heroImage,
    type: 'article',
    publishedTime: item.publishedAt || undefined,
    modifiedTime: item.updatedAt || undefined,
    section: item.category,
    tags: [item.category],
  });
}

async function NewsDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const [item, latest, categories] = await Promise.all([
    getNewsBySlug(slug),
    getLatestNews(4),
    getNewsCategories(),
  ]);

  if (!item) return notFound();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'News', item: '/news' },
    { name: item.title, item: `/news/${item.slug}` },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);
  const publishedAt = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const relatedItems = latest
    .filter((post) => post.id !== item.id)
    .slice(0, 4)
    .map((post, index) => ({
      name: post.title,
      url: `/news/${post.slug}`,
      position: index + 1,
    }));

  return (
    <>
      <PageSeo
        title={`${item.title} | News | ${SITE.shortName}`}
        description={item.excerpt || htmlToExcerpt(item.content, 160)}
        path={`/news/${item.slug}`}
        type="article"
        breadcrumbItems={breadcrumbItems}
        itemListProps={{
          name: 'Latest news',
          description: 'Recent news items from the utility.',
          url: '/news',
          items: relatedItems,
        }}
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': ['Article', 'NewsArticle'],
          headline: item.title,
          description: item.excerpt || htmlToExcerpt(item.content, 160),
          image: item.heroImage ? [absUrl(item.heroImage)] : undefined,
          datePublished: item.publishedAt || undefined,
          dateModified: item.updatedAt || item.publishedAt || undefined,
          mainEntityOfPage: absUrl(`/news/${item.slug}`),
          url: absUrl(`/news/${item.slug}`),
        }}
      />

      <Breadcrumb pageTitle={item.title} items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className={styles.detailLayout}>
            <article className={styles.articleCard}>
              <div className={styles.detailHero}>
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  width={960}
                  height={620}
                  className="img-fluid"
                  priority
                />
              </div>

              <div className={styles.articleBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.badge}>{item.category}</span>
                  {publishedAt && <span>{publishedAt}</span>}
                </div>
                <h1 className={styles.detailTitle}>{item.title}</h1>
                <p className={styles.detailLead}>
                  {item.excerpt || htmlToExcerpt(item.content, 160)}
                </p>
                <RichContent html={item.content} />

                <div className="mt-4">
                  <Link href="/news" className="btn btn-outline-primary">
                    Back to News
                  </Link>
                </div>
              </div>
            </article>

            <aside className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h2 className={styles.sidebarTitle}>Categories</h2>
                <div className={styles.sidebarLinks}>
                  <Link href="/news" className={styles.sidebarLink}>
                    All News
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/news?category=${category.slug}`}
                      className={styles.sidebarLink}
                    >
                      <span>{category.label}</span>
                      <span className={styles.sidebarCount}>{category.count}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.sidebarCard}>
                <h2 className={styles.sidebarTitle}>Latest Posts</h2>
                <div className={styles.latestPosts}>
                  {latest.map((post) => (
                    <Link key={post.id} href={`/news/${post.slug}`} className={styles.latestPost}>
                      <div className={styles.latestPostMeta}>{post.category}</div>
                      <div className={styles.latestPostTitle}>{post.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function NewsDetailPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading news…</div>}>
        <NewsDetailContent {...props} />
      </Suspense>
    </main>
  );
}
