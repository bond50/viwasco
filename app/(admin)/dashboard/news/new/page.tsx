import { NewsCreateForm } from '@/components/admin/dashboard/news/news-form';
import { listActiveNewsCategories } from '@/lib/data/admin/news/categories';

export default async function NewNewsPage() {
  const categories = await listActiveNewsCategories();
  return <NewsCreateForm categories={categories} />;
}
