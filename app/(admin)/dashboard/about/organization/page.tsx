// app/(dashboard)/dashboard/about/organization/page.tsx
import { Suspense } from 'react';

import type { OrganizationSettingsData } from '@/lib/types/about';

import { CreateOrganizationCard } from '@/components/admin/dashboard/organization/create/create-organization-card';
import { OrganizationSettingsShell } from '@/components/admin/dashboard/organization/settings-shell';
import { OrganizationDangerZone } from '@/components/admin/dashboard/organization/organization-danger-zone';

// Split getters.ts (tagged + cached)
import { getOrgIdentity } from '@/lib/data/admin/about/organization-settings/identity';
import { getOrgAdminAccess } from '@/lib/data/admin/about/organization-settings/admin-access';
import { getOrgBasic } from '@/lib/data/admin/about/organization-settings/basic';
import { getOrgIntroduction } from '@/lib/data/admin/about/organization-settings/introduction';
import { getOrgVisionMission } from '@/lib/data/admin/about/organization-settings/vision-mission';
import { getOrgCoreValuesHeader } from '@/lib/data/admin/about/organization-settings/core-values-header';
import { getOrgContact } from '@/lib/data/admin/about/organization-settings/contact';
import { getOrgLegal } from '@/lib/data/admin/about/organization-settings/legal';
import { getOrgSocialHours } from '@/lib/data/admin/about/organization-settings/social-hours';
import { getOrgHero } from '@/lib/data/admin/about/organization-settings/hero';

type PageProps = {
  searchParams: Promise<{ section?: string; tab?: string }>;
};

async function SettingsContent({ searchParams }: PageProps) {
  const search = await searchParams;

  const identity = await getOrgIdentity();
  if (!identity) return <CreateOrganizationCard />;

  // Load all sections in parallel
  const [
    adminAccess,
    basic,
    introduction,
    visionMission,
    coreValuesHeader,
    contact,
    legal,
    socialHours,
    homepageHero,
  ] = await Promise.all([
    getOrgAdminAccess(),
    getOrgBasic(),
    getOrgIntroduction(),
    getOrgVisionMission(),
    getOrgCoreValuesHeader(),
    getOrgContact(),
    getOrgLegal(),
    getOrgSocialHours(),
    getOrgHero(),
  ]);

  const data: OrganizationSettingsData = {
    id: identity.id,
    adminAccess: adminAccess ?? { emails: [], bootstrap: false },
    basic: basic ?? {
      name: identity.name,
      tagline: '',
      shortName: '',
      logo: null,
      featuredImage: null,
    },
    introduction: introduction ?? {
      introTitle: null,
      introDescription: null,
      bannerImage: null,
      introImage: null,
    },
    visionMission: visionMission ?? {
      vision: null,
      mission: null,
      visionIcon: null,
      missionIcon: null,
    },
    coreValuesHeader: coreValuesHeader ?? {
      coreValuesLeadText: null,
      coreValuesImage: null,
    },
    contact: contact ?? {
      websiteUrl: null,
      contactEmail: null,
      phone: null,
      address: null,
      footerAboutText: null,
      customerPortalEnabled: false,
      customerPortalLabel: null,
      customerPortalUrl: null,
      navigationVisibility: {
        about: true,
        services: true,
        projects: true,
        resources: true,
        news: true,
        tenders: true,
        careers: true,
        newsletters: true,
        contact: true,
      },
      serviceCentres: [],
    },
    legal: legal ?? {
      regulatorName: null,
      licenseNumber: null,
      licenseExpiry: null,
      customerCareHotline: null,
      whatsappNumber: null,
    },
    socialHours: socialHours ?? {
      socialLinks: [],
      workingHours: null,
    },
    flags: identity.flags,
    homepageHero: homepageHero ?? {
      enabled: true,
      variant: 'normal',
      contentMode: 'single',

      // Desktop defaults: video hero, left/plain, scroll & overlay on
      desktop: {
        show: true,
        useVideo: true,
        textAlign: 'left',
        textChrome: 'plain',
        showScrollCue: true,
        overlayStrength: 'medium',
      },

      // Mobile defaults: image hero, centered/plain, slightly softer overlay
      mobile: {
        show: true,
        useVideo: false,
        textAlign: 'center',
        textChrome: 'plain',
        showScrollCue: true,
        overlayStrength: 'soft',
      },

      kicker: null,
      heading: identity.name,
      subheading: null,

      videoSrc: null,
      mobileSrc: null,
      poster: null,
    },
  };

  return (
    <OrganizationSettingsShell
      organization={data}
      initialSectionKey={search.section ?? null}
      initialTabId={search.tab ?? null}
    />
  );
}

async function DangerZoneContent() {
  const identity = await getOrgIdentity();
  if (!identity) return null;
  return (
    <div className="mt-4">
      <OrganizationDangerZone id={identity.id} name={identity.name} />
    </div>
  );
}

export default function OrganizationSettingsPage(props: PageProps) {
  return (
    <>
      <Suspense fallback={<div className="p-6">Loading organization settings…</div>}>
        <SettingsContent {...props} />
      </Suspense>

      <Suspense fallback={<div className="p-6">Loading danger zone…</div>}>
        <DangerZoneContent />
      </Suspense>
    </>
  );
}
