// components/admin/dashboard/organization/settings-shell/index.tsx
'use client';

import React from 'react';
import {
  type SettingsSectionConfig,
  TabbedSettingsShell,
} from '@/components/admin/dashboard/common/tabbed-settings-shell';
import { BasicMediaTab } from '@/components/admin/dashboard/organization/tabs/basic-media';
import { IntroductionTab } from '@/components/admin/dashboard/organization/tabs/introduction';
import { VisionMissionTab } from '@/components/admin/dashboard/organization/tabs/vision-mission';
import { CoreValuesHeaderTab } from '@/components/admin/dashboard/organization/tabs/core-values-header';
import { ContactAddressTab } from '@/components/admin/dashboard/organization/tabs/contact-address';
import { LegalUtilityTab } from '@/components/admin/dashboard/organization/tabs/legal-utility';
import { SocialHoursTab } from '@/components/admin/dashboard/organization/tabs/social-hours';
import { AdminAccessTab } from '@/components/admin/dashboard/organization/tabs/admin-access';
import { HomepageHeroTab } from '@/components/admin/dashboard/organization/tabs/hero-settings';
import type { OrganizationSettingsData } from '@/lib/types/about';

type Props = {
  organization: OrganizationSettingsData;
  initialSectionKey?: string | null;
  initialTabId?: string | null;
};

const ORG_SECTIONS: SettingsSectionConfig<OrganizationSettingsData>[] = [
  {
    key: 'general',
    label: 'Public identity',
    topId: 'top-general',
    listId: 'general-list',
    contentId: 'general-tab-content',
    items: [
      {
        id: 'gen-basic',
        label: 'Identity & media',
        render: (org) => <BasicMediaTab orgId={org.id} initial={org.basic} />,
      },
      {
        id: 'gen-intro',
        label: 'About section',
        render: (org) => <IntroductionTab orgId={org.id} initial={org.introduction} />,
      },
      {
        id: 'gen-vm',
        label: 'Vision & mission',
        render: (org) => <VisionMissionTab orgId={org.id} initial={org.visionMission} />,
      },
      {
        id: 'gen-core',
        label: 'Core values intro',
        render: (org) => <CoreValuesHeaderTab orgId={org.id} initial={org.coreValuesHeader} />,
      },
      {
        id: 'gen-hero',
        label: 'Homepage hero',
        render: (org) => <HomepageHeroTab orgId={org.id} initial={org.homepageHero} />,
      },
    ],
  },
  {
    key: 'communications',
    label: 'Contact & public access',
    topId: 'top-communications',
    listId: 'comm-list',
    contentId: 'comm-tab-content',
    items: [
      {
        id: 'comm-contact',
        label: 'Contact details, footer & portal',
        render: (org) => <ContactAddressTab orgId={org.id} initial={org.contact} />,
      },
      {
        id: 'comm-social',
        label: 'Social links & hours',
        render: (org) => <SocialHoursTab orgId={org.id} initial={org.socialHours} />,
      },
    ],
  },
  {
    key: 'compliance',
    label: 'Governance & access',
    topId: 'top-compliance',
    listId: 'comp-list',
    contentId: 'comp-tab-content',
    items: [
      {
        id: 'comp-legal',
        label: 'Legal & utility',
        render: (org) => <LegalUtilityTab orgId={org.id} initial={org.legal} />,
      },
      {
        id: 'comp-admin',
        label: 'Admin access',
        render: (org) => (
          <AdminAccessTab
            orgId={org.id}
            initial={org.adminAccess ?? { emails: [], bootstrap: false }}
          />
        ),
      },
    ],
  },
];

export function OrganizationSettingsShell({
  organization,
  initialSectionKey,
  initialTabId,
}: Props) {
  return (
    <TabbedSettingsShell
      headerLabel="Organization Settings"
      data={organization}
      sections={ORG_SECTIONS}
      initialSectionKey={initialSectionKey}
      initialTabId={initialTabId}
    />
  );
}
