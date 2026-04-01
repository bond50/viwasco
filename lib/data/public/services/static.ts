export type ServiceDetail = {
  intro: string;
  bullets: string[];
  note?: string;
};

export type ServiceItem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  detail: ServiceDetail;
  heroImage: string;
};

export const services: ServiceItem[] = [
  {
    id: 'water-supply',
    slug: 'water-supply',
    name: 'Water Supply',
    summary:
      'Reliable, safe water distribution with strong quality controls and responsive support.',
    detail: {
      intro:
        'Amatsi Water provides water supply services, focusing on sustainable and efficient water management. They typically offer services such as:',
      bullets: [
        'Water Distribution: Supplying clean and safe drinking water to communities.',
        'Water Quality Management: Ensuring that water meets health and safety standards.',
        'Infrastructure Development: Building and maintaining water supply systems.',
        'Customer Support: Assisting customers with inquiries and service issues.',
      ],
      note:
        'For specific details about their services, coverage areas, and ongoing projects, please visit the official website or contact us directly.',
    },
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'sewer-services',
    slug: 'sewer-services',
    name: 'Sewer Services',
    summary:
      'Collection, conveyance, and treatment support to keep sanitation systems safe and resilient.',
    detail: {
      intro:
        'We help maintain safe sewer networks through routine monitoring, maintenance, and rapid response to blockages or overflows.',
      bullets: [
        'Network Maintenance: Inspection, clearing, and preventive care for sewer lines.',
        'Emergency Response: Rapid support to reduce service disruptions.',
        'Compliance Support: Guidance on safe connections and environmental standards.',
      ],
    },
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'water-bower-services',
    slug: 'water-bower-services',
    name: 'Water Bower Services',
    summary:
      'Water delivery to priority areas and events when network supply is limited.',
    detail: {
      intro:
        'Our water bower services provide scheduled or emergency delivery to customers where direct supply is unavailable.',
      bullets: [
        'Scheduled Delivery: Regular supply for institutions and communities.',
        'Emergency Delivery: Quick dispatch during outages or maintenance windows.',
        'Quality Assurance: Water delivered meets applicable safety standards.',
      ],
    },
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'exhauster-services',
    slug: 'exhauster-services',
    name: 'Exhauster Services',
    summary:
      'Safe, hygienic emptying of septic tanks and waste systems with proper disposal.',
    detail: {
      intro:
        'We provide professional exhauster services to ensure safe sanitation and protect public health.',
      bullets: [
        'Septic Tank Emptying: Scheduled and emergency pumping services.',
        'Safe Disposal: Transport and disposal at approved facilities.',
        'Site Hygiene: Clean, compliant operations to protect customers and staff.',
      ],
    },
    heroImage: '/assets/img/featured-default.jpg',
  },
  {
    id: 'water-quality-training',
    slug: 'water-quality-training',
    name: 'Water Quality Training',
    summary:
      'Capacity building for teams and communities on water safety and compliance.',
    detail: {
      intro:
        'We offer practical training programs that strengthen water quality management and monitoring practices.',
      bullets: [
        'Sampling & Testing: Hands-on guidance on sampling protocols and lab processes.',
        'Compliance Readiness: Training aligned to regulatory requirements.',
        'Community Awareness: Education on safe storage and usage practices.',
      ],
    },
    heroImage: '/assets/img/featured-default.jpg',
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((service) => service.slug === slug);
}
