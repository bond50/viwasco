import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getTeamSettings } from '@/lib/data/admin/about/content/leadership-settings/team';
import { listCategories } from '@/lib/data/admin/about/content/leadership';
import { TeamSettingsShell } from '@/components/admin/dashboard/leadership/teams/team-settings-shell';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string; tab?: string }>;
};

type SettingsContentProps = PageProps;

// Main settings content: this route is for EXISTING team members only
async function SettingsContent({ params, searchParams }: SettingsContentProps) {
  const { id } = await params;
  const search = await searchParams;

  const [team, categories] = await Promise.all([getTeamSettings(id), listCategories()]);

  if (categories.length === 0) {
    return (
      <div className="alert alert-info">
        No categories yet. Create one first from{' '}
        <Link href="/dashboard/about/leadership/categories">Leadership Categories</Link>.
      </div>
    );
  }

  if (!team) {
    // No team with this id → 404
    return notFound();
  }

  return (
    <TeamSettingsShell
      team={team}
      categories={categories}
      initialSectionKey={search.section ?? null}
      initialTabId={search.tab ?? null}
    />
  );
}

export default function TeamSettingsPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="p-6">Loading team member…</div>}>
      <SettingsContent {...props} />
    </Suspense>
  );
}
