// lib/seo/breadcrumb-utils.ts

// SEO-level breadcrumbs used by PageSeo / JSON-LD
export type SeoBreadcrumbItem = { name: string; item: string };

// UI-level breadcrumbs used by <Breadcrumb />
export type UiBreadcrumbItem = { label: string; href: string; isActive: boolean };

/**
 * Convert SEO breadcrumbItems → UI breadcrumb items for <Breadcrumb />.
 * Last item is marked as active.
 */
export function toUiBreadcrumbs(items: SeoBreadcrumbItem[]): UiBreadcrumbItem[] {
  return items.map((b, idx) => ({
    label: b.name,
    href: b.item,
    isActive: idx === items.length - 1,
  }));
}
