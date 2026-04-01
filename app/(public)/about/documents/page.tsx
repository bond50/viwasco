import type { Metadata } from 'next';
import { getDocuments, listDocumentCategories } from '@/lib/data/public/about/getters';
import { DocCategoriesList } from '@/components/public/about/doc-categories-list';
import { DocsList } from '@/components/public/about/doc-list';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Documents | ${SITE.shortName}`;
  const description =
    'Official documents, reports, and publications for customers and stakeholders.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/documents',
    type: 'website',
  });
}

export default async function DocumentsPage() {
  const [docs, cats] = await Promise.all([getDocuments(), listDocumentCategories()]);

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Documents', item: '/about/documents' },
  ];

  const itemListProps =
    docs.length > 0
      ? {
          name: `Documents | ${SITE.shortName}`,
          description: 'List of published documents, reports, and downloadable resources.',
          url: '/about/documents',
          items: docs.map((doc, index) => ({
            name: doc.title,
            url: `/about/documents#doc-${doc.id}`,
            position: index + 1,
          })),
        }
      : undefined;

  return (
    <main className="container py-4">
      <PageSeo
        title={`Documents | ${SITE.shortName}`}
        description="Official documents, reports, and publications for customers and stakeholders."
        path="/about/documents"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={itemListProps}
      />

      <Breadcrumb pageTitle="Documents" items={toUiBreadcrumbs(breadcrumbItems)} />

      <h1 className="h3 mb-3">Documents</h1>

      <section>
        <h2 className="h6">Categories</h2>
        <DocCategoriesList items={cats} />
      </section>

      <section className="mt-4">
        <h2 className="h6">All Documents</h2>
        <DocsList items={docs} />
      </section>
    </main>
  );
}
