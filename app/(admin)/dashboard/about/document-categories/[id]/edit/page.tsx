// app/(dashboard)/dashboard/about/document-categories/[id]/edit/page-seo.tsx
import { getDocumentCategoryById } from '@/lib/data/admin/about/content/document-categories';
import { DocumentCategoryEditForm } from '@/components/admin/dashboard/documents/document-category-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditDocumentCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getDocumentCategoryById(id);

  if (!category) {
    throw new Error('Document category not found');
  }

  return <DocumentCategoryEditForm category={category} />;
}
