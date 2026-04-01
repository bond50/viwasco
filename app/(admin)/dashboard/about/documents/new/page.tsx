import { listDocumentCategories } from '@/lib/data/admin/about/content/document-categories';
import { DocumentCreateForm } from '@/components/admin/dashboard/documents/document-form';

export default async function NewDocumentPage() {
  const categories = await listDocumentCategories();
  return <DocumentCreateForm categories={categories} />;
}
