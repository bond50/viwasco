export type ResourceItem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
};

export const resources: ResourceItem[] = [
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
