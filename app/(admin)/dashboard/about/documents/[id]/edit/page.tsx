import { getDocumentById } from '@/lib/data/admin/about/content/documents';
import { listDocumentCategories } from '@/lib/data/admin/about/content/document-categories';
import { DocumentEditForm } from '@/components/admin/dashboard/documents/document-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditDocumentPage({ params }: Props) {
  const { id } = await params;

  const [doc, categories] = await Promise.all([getDocumentById(id), listDocumentCategories()]);

  if (!doc) {
    throw new Error('Document not found');
  }

  return <DocumentEditForm doc={doc} categories={categories} />;
}
