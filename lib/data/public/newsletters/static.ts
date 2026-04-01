export type NewsletterCategory = {
  id: string;
  label: string;
};

export type NewsletterItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string[];
  categoryId: string;
  publishedAt: string;
  downloads: number;
  sizeMb: number;
  pdfUrl: string;
  heroImage: string;
};

export const newsletterCategories: NewsletterCategory[] = [
  { id: 'monthly', label: 'Monthly Updates' },
  { id: 'community', label: 'Community' },
  { id: 'operations', label: 'Operations' },
];

const PDF_URL =
  'https://res.cloudinary.com/dwtcilinl/image/upload/v1735490845/Tenders/tfceoks5seopuqh41xye.pdf';

const baseNewsletters: NewsletterItem[] = [
  {
    id: 'nl-1',
    slug: 'february-2026-community-update',
    title: 'February 2026 Community Update',
    excerpt: 'Service highlights, project milestones, and customer care tips for the month.',
    categoryId: 'community',
    publishedAt: 'Feb 2026',
    downloads: 824,
    sizeMb: 2.1,
    pdfUrl: PDF_URL,
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'nl-2',
    slug: 'january-2026-service-brief',
    title: 'January 2026 Service Brief',
    excerpt: 'New kiosk sites, water quality monitoring, and planned maintenance updates.',
    categoryId: 'operations',
    publishedAt: 'Jan 2026',
    downloads: 612,
    sizeMb: 1.8,
    pdfUrl: PDF_URL,
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'nl-3',
    slug: 'december-2025-year-end-review',
    title: 'December 2025 Year-End Review',
    excerpt: 'Key achievements, investments, and service improvements from the past year.',
    categoryId: 'monthly',
    publishedAt: 'Dec 2025',
    downloads: 1094,
    sizeMb: 2.4,
    pdfUrl: PDF_URL,
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'nl-4',
    slug: 'november-2025-operations-update',
    title: 'November 2025 Operations Update',
    excerpt: 'Network reliability improvements and NRW reduction progress.',
    categoryId: 'operations',
    publishedAt: 'Nov 2025',
    downloads: 533,
    sizeMb: 1.9,
    pdfUrl: PDF_URL,
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'nl-5',
    slug: 'october-2025-community-brief',
    title: 'October 2025 Community Brief',
    excerpt: 'Community engagement activities and service clinic highlights.',
    categoryId: 'community',
    publishedAt: 'Oct 2025',
    downloads: 472,
    sizeMb: 1.6,
    pdfUrl: PDF_URL,
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'nl-6',
    slug: 'september-2025-monthly-update',
    title: 'September 2025 Monthly Update',
    excerpt: 'Billing improvements and customer care response updates.',
    categoryId: 'monthly',
    publishedAt: 'Sep 2025',
    downloads: 685,
    sizeMb: 2.0,
    pdfUrl: PDF_URL,
    heroImage: '/assets/img/featured-default.jpg',
  },
];

function expandNewsletters(base: NewsletterItem[], count: number): NewsletterItem[] {
  if (base.length >= count) return base;
  const next: NewsletterItem[] = [...base];
  let i = 1;
  while (next.length < count) {
    const src = base[(next.length - base.length) % base.length];
    next.push({
      ...src,
      id: `${src.id}-x${i}`,
      slug: `${src.slug}-copy-${i}`,
      title: `${src.title} (Copy ${i})`,
      downloads: Math.max(120, src.downloads - i * 12),
    });
    i += 1;
  }
  return next;
}

export const newsletters = expandNewsletters(baseNewsletters, 30);

export function getNewsletterBySlug(slug: string): NewsletterItem | undefined {
  return newsletters.find((item) => item.slug === slug);
}

export function getPaginatedNewsletters(
  categoryId: string | undefined,
  page: number,
  pageSize: number,
): {
  items: NewsletterItem[];
  total: number;
  totalPages: number;
  page: number;
} {
  const filtered = categoryId
    ? newsletters.filter((item) => item.categoryId === categoryId)
    : newsletters;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, totalPages, page: safePage };
}

