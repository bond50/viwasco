// app/(admin)/dashboard/about/leadership/teams/new/page.tsx
import { notFound } from 'next/navigation';

import { listCategories } from '@/lib/data/admin/about/content/leadership';
import { CreateTeamMemberCard } from '@/components/admin/dashboard/leadership/teams/create-team-member-card';

type Search = {
  // Next 16: searchParams is a Promise in async server components
  searchParams?: Promise<{ categoryId?: string }>;
};

export default async function NewTeamPage({ searchParams }: Search) {
  const cats = await listCategories();
  if (cats.length === 0) return notFound();

  const params = (await searchParams) ?? {};
  const fromQuery = params.categoryId;

  const selectedCategoryId =
    fromQuery && cats.some((c) => c.id === fromQuery) ? fromQuery : cats[0].id;

  const categoryOptions = cats.map((c) => ({ id: c.id, name: c.name }));

  return (
    <CreateTeamMemberCard initialCategoryId={selectedCategoryId} categories={categoryOptions} />
  );
}
