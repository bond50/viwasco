// components/public/layout/site-header/header.tsx
import styles from './header.module.css';

import { buildAboutNode } from '@/components/public/layout/site-header/nodes/nav.about';
import { normalizeNav } from '@/components/public/layout/site-header/nav-helpers';
import { NAV_BASE } from '@/components/public/layout/site-header/nav-base';
import type { MenuNode } from '@/components/public/layout/site-header/nav.types';

import { fetchAboutForNav } from '@/lib/data/public/about/fetch-about-for-nav';
import { getOrganizationShell } from '@/lib/data/public/about/shell';
import { getServices } from '@/lib/data/public/services/getters';
import { getResourceSections } from '@/lib/data/public/resources/getters';
import { tenderStatuses } from '@/lib/data/public/tenders/getters';
import { getCareerTypes } from '@/lib/data/public/careers/getters';

import { ensureUploadedImage, getBestImageUrl } from '@/lib/assets/core';

import { TopBar } from '@/components/public/layout/site-header/topbar/top-row.server';
import { Logo } from '@/components/public/layout/site-header/logo';
import NavMenu from '@/components/public/layout/site-header/nav-menu.client';
import HeaderScrollWatcher from '@/components/public/layout/site-header/header-scroll.client';

export async function SiteHeader() {
  const [aboutData, org, services, resourceSections, careerTypes] = await Promise.all([
    fetchAboutForNav(),
    getOrganizationShell(),
    getServices(),
    getResourceSections(),
    getCareerTypes(),
  ]);

  const visibility = org?.navigationVisibility ?? {
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

  const aboutNode = visibility.about ? buildAboutNode('About', '/about', aboutData) : undefined;
  const servicesNode = visibility.services
    ? {
        label: 'Services',
        href: '/services',
        match: { startsWith: ['/services'] },
        children: services.map((service) => ({
          label: service.name,
          href: `/services/${service.slug}`,
        })),
      }
    : undefined;

  const projectsNode = visibility.projects
    ? {
        label: 'Projects',
        href: '/projects',
        match: { startsWith: ['/projects'] },
        children: [
          { label: 'Ongoing', href: '/projects?status=ongoing' },
          { label: 'Completed', href: '/projects?status=completed' },
        ],
      }
    : undefined;

  const resourcesNode = visibility.resources
    ? {
        label: 'Resources',
        href: '/resources',
        match: { startsWith: ['/resources'] },
        children: [
          { label: 'Bill Calculator', href: '/resources/bill-calculator' },
          ...resourceSections.map((resource) => ({
            label: resource.name,
            href: `/resources/${resource.slug}`,
          })),
        ],
      }
    : undefined;

  const tendersNode = visibility.tenders
    ? {
        label: 'Tenders',
        href: '/tenders',
        match: { startsWith: ['/tenders'] },
        children: tenderStatuses.map((status) => ({
          label: status.label,
          href: `/tenders?status=${status.id}`,
        })),
      }
    : undefined;

  const careersNode = visibility.careers
    ? {
        label: 'Careers',
        href: '/careers',
        match: { startsWith: ['/careers'] },
        children:
          careerTypes.length > 0
            ? careerTypes.map((type) => ({
                label: type.label,
                href: `/careers?type=${type.slug}`,
              }))
            : undefined,
      }
    : undefined;

  const newsNode = visibility.news || visibility.newsletters
    ? {
        label: 'News & Updates',
        match: { startsWith: ['/news', '/newsletters'] },
        children: [
          ...(visibility.news ? [{ label: 'News', href: '/news' }] : []),
          ...(visibility.newsletters ? [{ label: 'Newsletters', href: '/newsletters' }] : []),
        ] as MenuNode[],
      }
    : undefined;

  const contactNode = visibility.contact
    ? {
        label: 'Contact',
        href: '/contact',
        match: { startsWith: ['/contact'] },
      }
    : undefined;

  const portalNode =
    org?.customerPortalEnabled && org.customerPortalUrl
      ? {
          label: (org.customerPortalLabel && org.customerPortalLabel.trim()) || 'Customer Portal',
          href: org.customerPortalUrl,
          variant: 'portal' as const,
        }
      : null;

  const tree = normalizeNav(NAV_BASE, {
    about: aboutNode,
    services: servicesNode,
    projects: projectsNode,
    resources: resourcesNode,
    news: newsNode,
    tenders: tendersNode,
    careers: careersNode,
    contact: contactNode,
    customerPortal: portalNode ?? undefined,
  });

  const logoImg = ensureUploadedImage(org?.logo);
  const logoSrc =
    getBestImageUrl(logoImg, ['avatar', 'small', 'medium', 'large', 'original']) ??
    '/assets/img/logo.png';

  return (
    <header id="top" className={`${styles.header} sticky-top`}>
      <HeaderScrollWatcher />
      <TopBar />
      <div className={styles.branding}>
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <Logo logoSrc={logoSrc} />
          <NavMenu tree={tree} />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
