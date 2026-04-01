export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  category: string;
  heroImage: string;
};

export const news: NewsItem[] = [
  {
    id: 'news-1',
    slug: 'service-restoration-update-zone-3',
    title: 'Service Restoration Update for Zone 3',
    excerpt: 'Repairs are complete and supply is stabilizing. Flushing will continue through the evening.',
    body: [
      'We have completed the critical repairs in Zone 3 and water supply has been restored to most areas.',
      'Our teams will continue flushing lines and monitoring pressure through the evening to ensure stability.',
      'Customers may experience temporary discoloration as the system normalizes. Please report issues to customer care.',
    ],
    publishedAt: 'Feb 18, 2026',
    category: 'Service Updates',
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'news-2',
    slug: 'new-customer-service-hotline',
    title: 'New Customer Service Hotline Now Active',
    excerpt: 'We have launched a dedicated hotline to improve response time and support.',
    body: [
      'Our new hotline is now active to improve response times and issue tracking.',
      'Customers can reach us on the updated number during business hours for service requests and billing support.',
      'We are also expanding WhatsApp support to provide quicker updates on outages and maintenance windows.',
    ],
    publishedAt: 'Feb 10, 2026',
    category: 'Customer Care',
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'news-3',
    slug: 'meter-reading-schedule-update',
    title: 'Meter Reading Schedule Update',
    excerpt: 'Updated reading windows will help improve billing accuracy across all zones.',
    body: [
      'We are updating the meter reading schedule to improve billing accuracy and reduce estimated bills.',
      'Customers will receive SMS alerts 48 hours before reading starts in their zone.',
      'Please ensure meter access is clear and secure to avoid missed readings.',
    ],
    publishedAt: 'Jan 29, 2026',
    category: 'Billing',
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'news-4',
    slug: 'water-quality-advisory-update',
    title: 'Water Quality Advisory Update',
    excerpt: 'Routine tests confirm safe supply. Additional sampling continues in high-demand areas.',
    body: [
      'Routine tests confirm supply remains within safe limits across the network.',
      'Additional sampling will continue in high-demand areas to ensure quality remains stable.',
      'Please contact customer care if you experience unusual color or odor in your supply.',
    ],
    publishedAt: 'Jan 12, 2026',
    category: 'Water Quality',
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'news-5',
    slug: 'new-kiosk-sites-opened',
    title: 'New Community Water Kiosk Sites Opened',
    excerpt: 'Three new kiosks are now serving underserved neighborhoods.',
    body: [
      'Three new kiosks are now operational to improve access to safe water in underserved areas.',
      'Each kiosk includes improved storage and queue management to reduce waiting time.',
      'We are working with local leaders to expand coverage to additional neighborhoods.',
    ],
    publishedAt: 'Dec 20, 2025',
    category: 'Community',
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'news-6',
    slug: 'planned-maintenance-feb-2026',
    title: 'Planned Maintenance Scheduled for February',
    excerpt: 'Network upgrades will require temporary service interruptions in select zones.',
    body: [
      'We will conduct scheduled maintenance to improve reliability and reduce leaks.',
      'Temporary interruptions are expected in select zones during the maintenance window.',
      'Customers will receive SMS notices 24 hours before works begin.',
    ],
    publishedAt: 'Dec 05, 2025',
    category: 'Maintenance',
    heroImage: '/assets/img/featured-default.jpg',
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return news.find((item) => item.slug === slug);
}
