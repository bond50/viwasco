import { Suspense } from 'react';
import Link from 'next/link';

import { SimpleList, type SimpleRow } from '@/components/common/simple-list';
import { deleteProject } from '@/actions/projects';
import { listProjects } from '@/lib/data/admin/projects';

function Fallback() {
  return <div className="alert alert-info">Loading projects…</div>;
}

async function Content() {
  const rowsRaw = await listProjects();

  const rows: SimpleRow[] = rowsRaw.map((row) => ({
    id: row.id,
    title: row.title,
    extra1: row.categoryName ?? 'Uncategorized',
    extra2: row.status.toLowerCase(),
  }));

  async function onDeleteAction(id: string) {
    'use server';
    await deleteProject(id);
  }

  return (
    <>
      <SimpleList
        headerLabel="Projects"
        editBasePath="/dashboard/projects"
        rows={rows}
        onDeleteAction={onDeleteAction}
        addHref="/dashboard/projects/new"
        columns={{
          nameLabel: 'Title',
          extra1Label: 'Category',
          extra2Label: 'Status',
        }}
      />

      <div className="mt-3 d-flex justify-content-end">
        <Link className="btn btn-outline-primary" href="/dashboard/projects/categories">
          Manage Project Categories
        </Link>
      </div>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Content />
    </Suspense>
  );
}
