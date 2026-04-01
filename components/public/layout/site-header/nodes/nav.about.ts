import type { MenuNode } from '../nav.types';
import type { NavAboutData } from '@/lib/data/public/about/fetch-about-for-nav';

const compact = <T,>(arr: (T | null | undefined)[]) =>
  arr.filter(Boolean) as T[];

export function buildAboutNode(
  baseLabel: string,
  baseHref: string,
  d: NavAboutData,
): MenuNode {
  const leadershipChildren = compact<MenuNode>([
    d.hasLeadershipTeam ? { label: 'Team', href: `${baseHref}/leadership` } : null,
    d.hasMessage ? { label: 'Messages', href: `${baseHref}/leadership/messages` } : null,
  ]);

  const recognitionChildren = compact<MenuNode>([
    d.hasAwards ? { label: 'Awards', href: `${baseHref}/awards` } : null,
    d.hasCerts ? { label: 'Certifications', href: `${baseHref}/certifications` } : null,
  ]);

  const documentsChildren = d.docCats.length
    ? [
        { label: 'All Documents', href: `${baseHref}/documents` },
        {
          label: 'By Category',
          children: d.docCats.map((c) => ({
            label: c.name,
            href: `${baseHref}/documents/categories/${encodeURIComponent(c.slug)}`,
          })),
        },
      ]
    : [];

  const children: MenuNode[] = compact<MenuNode>([
    { label: 'Overview', href: baseHref },

    // 🔹 NEW: only show if mission/vision exist in Organization
    d.hasMissionVision
      ? { label: 'Mission & Vision', href: `${baseHref}/mission-vision` }
      : null,

    leadershipChildren.length
      ? { label: 'Leadership', children: leadershipChildren }
      : null,

    d.hasValues ? { label: 'Core Values', href: `${baseHref}/core-values` } : null,
    d.hasMetrics ? { label: 'Metrics', href: `${baseHref}/metrics` } : null,
    d.hasMilestones ? { label: 'Milestones', href: `${baseHref}/milestones` } : null,
    d.hasFaqs ? { label: 'FAQs', href: `${baseHref}/faqs` } : null,

    recognitionChildren.length
      ? { label: 'Recognition', children: recognitionChildren }
      : null,

    d.hasTestimonials
      ? { label: 'Testimonials', href: `${baseHref}/testimonials` }
      : null,
    d.hasPartners ? { label: 'Partners', href: `${baseHref}/partners` } : null,
    documentsChildren.length ? { label: 'Documents', children: documentsChildren } : null,
  ]);

  return {
    label: baseLabel,
    href: baseHref,
    match: { startsWith: [baseHref] },
    children,
  };
}
