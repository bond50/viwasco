import { NewsletterCreateForm } from '@/components/admin/dashboard/newsletters/newsletter-form';
import { listNewsletterCategories } from '@/lib/data/admin/newsletters/categories';

export default async function NewNewsletterPage() {
  const categoriesRaw = await listNewsletterCategories();
  const categories = categoriesRaw.map((category) => ({
    id: category.id,
    slug: category.slug,
    label: category.name,
  }));
  return <NewsletterCreateForm categories={categories} />;
}
