'use client';

import React from 'react';
import {
  type SettingsSectionConfig,
  TabbedSettingsShell,
} from '@/components/admin/dashboard/common/tabbed-settings-shell';
import type { TeamSettingsData } from '@/lib/types/about/leadership';
import type { AdminLeadershipCategoryRow } from '@/lib/data/admin/about/content/leadership';

import { TeamBasicTab } from '@/components/admin/dashboard/leadership/teams/tabs/basic';
import { TeamContactTab } from '@/components/admin/dashboard/leadership/teams/tabs/contact';
import { TeamListsTab } from '@/components/admin/dashboard/leadership/teams/tabs/lists';
import { TeamSocialTab } from '@/components/admin/dashboard/leadership/teams/tabs/social';
import { TeamBioTab } from '@/components/admin/dashboard/leadership/teams/tabs/profile-bio';
import { TeamEducationSection } from '@/components/admin/dashboard/leadership/teams/sections/team-education-section';
import { TeamExperienceSection } from '@/components/admin/dashboard/leadership/teams/sections/team-experience-section';
import { TeamAchievementSection } from '@/components/admin/dashboard/leadership/teams/sections/team-achievement-section';
import { TeamPublicationSection } from '@/components/admin/dashboard/leadership/teams/sections/team-publication-section';
import { TeamWorkingHoursTab } from '@/components/admin/dashboard/leadership/teams/tabs/contact/working-hours';
import { TeamFlagsTab } from '@/components/admin/dashboard/leadership/teams/tabs/flags';

type TeamShellData = {
  team: TeamSettingsData;
  categories: AdminLeadershipCategoryRow[];
};

type Props = {
  team: TeamSettingsData;
  categories: AdminLeadershipCategoryRow[];
  initialSectionKey?: string | null;
  initialTabId?: string | null;
};

const TEAM_SECTIONS: SettingsSectionConfig<TeamShellData>[] = [
  {
    key: 'general',
    label: 'General',
    topId: 'top-general',
    listId: 'general-list',
    contentId: 'general-tab-content',
    items: [
      {
        id: 'gen-basic',
        label: 'Basic & Media',
        render: (data) => (
          <TeamBasicTab
            team={data.team}
            categories={data.categories.map((c) => ({
              id: c.id,
              name: c.name,
            }))}
          />
        ),
      },
    ],
  },

  {
    key: 'profile',
    label: 'Profile',
    topId: 'top-profile',
    listId: 'profile-list',
    contentId: 'profile-tab-content',
    items: [
      {
        id: 'prof-bio',
        label: 'Bio',
        render: (data) => <TeamBioTab team={data.team} />,
      },
      {
        id: 'prof-education',
        label: 'Education',
        render: (data) => (
          <TeamEducationSection teamId={data.team.id} educations={data.team.educations} />
        ),
      },
      {
        id: 'prof-experience',
        label: 'Experience',
        render: (data) => (
          <TeamExperienceSection teamId={data.team.id} experiences={data.team.experiences} />
        ),
      },
      {
        id: 'prof-achievements',
        label: 'Achievements',
        render: (data) => (
          <TeamAchievementSection teamId={data.team.id} achievements={data.team.achievements} />
        ),
      },
      {
        id: 'prof-publications',
        label: 'Publications',
        render: (data) => (
          <TeamPublicationSection teamId={data.team.id} publications={data.team.publications} />
        ),
      },
    ],
  },

  {
    key: 'contact',
    label: 'Contact',
    topId: 'top-contact',
    listId: 'contact-list',
    contentId: 'contact-tab-content',
    items: [
      {
        id: 'contact-main',
        label: 'Contact Details',
        render: (data) => <TeamContactTab team={data.team} />,
      },
      {
        id: 'contact-social',
        label: 'Social Links',
        render: (data) => <TeamSocialTab team={data.team} />,
      },
      {
        id: 'contact-hours',
        label: 'Working Hours',
        render: (data) => <TeamWorkingHoursTab team={data.team} />,
      },
    ],
  },

  {
    key: 'settings',
    label: 'Settings',
    topId: 'top-settings',
    listId: 'settings-list',
    contentId: 'settings-tab-content',
    items: [
      {
        id: 'settings-flags',
        label: 'Flags & Visibility',
        render: (data) => <TeamFlagsTab team={data.team} />,
      },
      {
        id: 'settings-lists',
        label: 'Lists & Committees',
        render: (data) => <TeamListsTab team={data.team} />,
      },
    ],
  },
];

export function TeamSettingsShell({ team, categories, initialSectionKey, initialTabId }: Props) {
  const data: TeamShellData = { team, categories };
  const headerLabel = `Leadership: ${team.basic.name}`;

  return (
    <TabbedSettingsShell
      headerLabel={headerLabel}
      data={data}
      sections={TEAM_SECTIONS}
      initialSectionKey={initialSectionKey}
      initialTabId={initialTabId}
    />
  );
}
