import Link from 'next/link';

import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteNews } from '@/actions/news';
import { listNews } from '@/lib/data/admin/news';

export default async function NewsPage() {
  const rowsRaw = await listNews();
  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.category,
    extra2: row.is_active ? 'Active' : 'Hidden',
  }));

  return (
    <>
      <SimpleList
        headerLabel="News"
        rows={rows}
        onDeleteAction={deleteNews}
        editBasePath="/dashboard/news"
        addHref="/dashboard/news/new"
        columns={{ nameLabel: 'Title', extra1Label: 'Category', extra2Label: 'Visibility' }}
      />
      <div className="mt-3">
        <Link href="/dashboard/news/categories" className="btn btn-outline-primary btn-sm">
          Manage News Categories
        </Link>
      </div>
    </>
  );
}
