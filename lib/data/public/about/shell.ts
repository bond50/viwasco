import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { getOrganizationOverview } from '@/lib/data/public/about/getters';
import { ABOUT_NAV_TAG, ORG_ORGANIZATION_TAG } from '@/lib/cache/tags';
import { coerceJsonToRawLinks, processSocialLinks } from '@/lib/social-links';
import { parseWorkingHours, workingHoursTopbarLabel } from '@/lib/working-hours';
import type { NavigationVisibilityState } from '@/lib/types/about';

export type PublicOrgContactDetail = {
  kind: 'address' | 'phone' | 'email';
  label: string;
  value: string | null;
};

export type PublicOrganizationShell = {
  id: string;
  name: string;
  shortName: string | null;
  logo: unknown;
  description: string | null;
  introDescription: string | null;
  footerAboutText: string | null;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  contactDetails: PublicOrgContactDetail[];
  customerPortalEnabled: boolean;
  customerPortalLabel: string | null;
  customerPortalUrl: string | null;
  serviceCentres: Array<{ name: string; address: string }>;
  navigationVisibility: NavigationVisibilityState;
  socialLinks: ReturnType<typeof processSocialLinks>;
  workingHoursLabel: string | null;
  workingHours: Array<{ days: string; hours: string }>;
  customerCareHotline: string | null;
  whatsappNumber: string | null;
};

function normalizeVisibility(input: unknown): NavigationVisibilityState {
  const defaultVisibility: NavigationVisibilityState = {
    about: true,
    services: true,
    projects: true,
    resources: true,
    news: true,
    tenders: true,
    careers: true,
    newsletters: true,
    contact: true,
  };

  const bag = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  return Object.keys(defaultVisibility).reduce((acc, key) => {
    const typedKey = key as keyof NavigationVisibilityState;
    acc[typedKey] = typeof bag[typedKey] === 'boolean' ? (bag[typedKey] as boolean) : defaultVisibility[typedKey];
    return acc;
  }, {} as NavigationVisibilityState);
}

export async function getOrganizationShell(): Promise<PublicOrganizationShell | null> {
  'use cache';
  cacheLife('days');
  cacheTag(ORG_ORGANIZATION_TAG);
  cacheTag(ABOUT_NAV_TAG);

  const org = await getOrganizationOverview();
  if (!org) return null;

  const navigation = normalizeVisibility((org.metadata as Record<string, unknown> | null | undefined)?.navigation);
  const socialLinks = processSocialLinks(coerceJsonToRawLinks(org.socialLinks));
  const contactDetails: PublicOrgContactDetail[] = [
    { kind: 'address', label: 'Address', value: org.address ?? null },
    { kind: 'phone', label: 'Telephone', value: org.phone ?? null },
    { kind: 'email', label: 'Email', value: org.contactEmail ?? null },
  ];

  return {
    id: org.id,
    name: org.name,
    shortName: org.shortName ?? null,
    logo: org.logo,
    description: org.description ?? null,
    introDescription: org.introDescription ?? null,
    footerAboutText: org.footerAboutText ?? null,
    contactEmail: org.contactEmail ?? null,
    phone: org.phone ?? null,
    address: org.address ?? null,
    contactDetails,
    customerPortalEnabled: org.customerPortalEnabled ?? false,
    customerPortalLabel: org.customerPortalLabel ?? null,
    customerPortalUrl: org.customerPortalUrl ?? null,
    serviceCentres: Array.isArray(org.serviceCentres)
      ? (org.serviceCentres as Array<{ name: string; address: string }>)
      : [],
    navigationVisibility: navigation,
    socialLinks,
    workingHoursLabel: workingHoursTopbarLabel(org.workingHours),
    workingHours: parseWorkingHours(org.workingHours),
    customerCareHotline: org.customerCareHotline ?? null,
    whatsappNumber: org.whatsappNumber ?? null,
  };
}
