import { notFound } from 'next/navigation';
import { NewsletterEditForm } from '@/components/admin/dashboard/newsletters/newsletter-form';
import { getNewsletterById } from '@/lib/data/admin/newsletters';
import { listNewsletterCategories } from '@/lib/data/admin/newsletters/categories';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const [row, categoriesRaw] = await Promise.all([
    getNewsletterById(id),
    listNewsletterCategories(),
  ]);
  if (!row) return notFound();
  const categories = categoriesRaw.map((category) => ({
    id: category.id,
    slug: category.slug,
    label: category.name,
  }));
  return (
    <NewsletterEditForm
      row={{ ...row, file: row.file, hero_image: row.hero_image }}
      categories={categories}
    />
  );
}
