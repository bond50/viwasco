import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getDocumentsByCategorySlug } from '@/lib/data/public/about/getters';
import { DocsList } from '@/components/public/about/doc-list';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const docs = await getDocumentsByCategorySlug(slug);
  const categoryName = docs[0]?.category?.name ?? slug.replace(/-/g, ' ');
  const title = `Documents — ${categoryName} | ${SITE.shortName}`;
  const description = `Published documents in the ${categoryName} category.`;
  return generatePageMetadata({
    title,
    description,
    path: `/about/documents/${slug}`,
    type: 'website',
  });
}

async function DocumentsByCategoryContent({ slug }: { slug: string }) {
  const docs = await getDocumentsByCategorySlug(slug);
  const categoryName = docs[0]?.category?.name ?? slug.replace(/-/g, ' ');

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Documents', item: '/about/documents' },
    { name: categoryName, item: `/about/documents/${slug}` },
  ];

  const itemListProps =
    docs.length > 0
      ? {
          name: `Documents — ${categoryName}`,
          description: `Documents under the ${categoryName} category.`,
          url: `/about/documents/${slug}`,
          items: docs.map((doc, index) => ({
            name: doc.title,
            url: `/about/documents/${slug}#doc-${doc.id}`,
            position: index + 1,
          })),
        }
      : undefined;

  return (
    <main className="container py-4">
      <PageSeo
        title={`Documents — ${categoryName} | ${SITE.shortName}`}
        description={`Published documents in the ${categoryName} category.`}
        path={`/about/documents/${slug}`}
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={itemListProps}
      />

      <Breadcrumb
        pageTitle={`Documents — ${categoryName}`}
        items={toUiBreadcrumbs(breadcrumbItems)}
      />

      <h1 className="h3 mb-3">Documents — {categoryName}</h1>
      <DocsList items={docs} />
    </main>
  );
}

export default function DocumentsByCategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<main className="container py-4">Loading documents…</main>}>
      {params.then(({ slug }) => (
        <DocumentsByCategoryContent slug={slug} />
      ))}
    </Suspense>
  );
}
