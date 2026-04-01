export const RESOURCE_KIND_VALUES = [
  'reports',
  'tariffs',
  'strategic-plan',
  'downloads',
  'notices',
] as const;

export type ResourceKind = (typeof RESOURCE_KIND_VALUES)[number];

export type ResourceCategoryOption = {
  id: string;
  label: string;
};

export type ResourceSectionCard = {
  id: string;
  slug: string;
  name: string;
  summary: string;
};

export const RESOURCE_KIND_OPTIONS: Array<{
  value: ResourceKind;
  label: string;
}> = [
  { value: 'reports', label: 'Reports' },
  { value: 'tariffs', label: 'Tariffs' },
  { value: 'strategic-plan', label: 'Strategic Plan' },
  { value: 'downloads', label: 'Downloads' },
  { value: 'notices', label: 'Notices' },
];

export const RESOURCE_CATEGORIES: Record<ResourceKind, ResourceCategoryOption[]> = {
  reports: [
    { id: 'annual', label: 'Annual Reports' },
    { id: 'performance', label: 'Performance' },
    { id: 'customer', label: 'Customer Experience' },
  ],
  tariffs: [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'meter', label: 'Meter Rent' },
  ],
  'strategic-plan': [
    { id: 'strategy', label: 'Strategy' },
    { id: 'projects', label: 'Capital Projects' },
    { id: 'sustainability', label: 'Sustainability' },
  ],
  downloads: [
    { id: 'forms', label: 'Forms' },
    { id: 'guides', label: 'Guides' },
    { id: 'policies', label: 'Policies' },
  ],
  notices: [
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'quality', label: 'Water Quality' },
    { id: 'service', label: 'Customer Service' },
  ],
};

export const RESOURCE_SECTION_CARDS: ResourceSectionCard[] = [
  {
    id: 'bill-calculator',
    slug: 'bill-calculator',
    name: 'Bill Calculator',
    summary: 'Estimate monthly water and sewer charges based on usage and meter size.',
  },
  {
    id: 'reports',
    slug: 'reports',
    name: 'Reports',
    summary: 'Access annual reports, performance reviews, and service updates.',
  },
  {
    id: 'tariffs',
    slug: 'tariffs',
    name: 'Tariffs',
    summary: 'Review the latest approved tariffs and billing structures.',
  },
  {
    id: 'strategic-plan',
    slug: 'strategic-plan',
    name: 'Strategic Plan',
    summary: 'Learn about our medium-term priorities and growth roadmap.',
  },
  {
    id: 'downloads',
    slug: 'downloads',
    name: 'Downloads',
    summary: 'Forms, guidelines, and downloadable resources for customers.',
  },
  {
    id: 'notices',
    slug: 'notices',
    name: 'Notices',
    summary: 'Public notices, service alerts, and scheduled maintenance updates.',
  },
];
