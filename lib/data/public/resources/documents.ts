export type ResourceKind =
  | 'reports'
  | 'tariffs'
  | 'strategic-plan'
  | 'downloads'
  | 'notices'
  | 'tenders';

export type ResourceCategory = {
  id: string;
  label: string;
};

export type ResourceDoc = {
  id: string;
  title: string;
  summary: string;
  type: 'pdf' | 'doc' | 'xls' | 'link';
  categoryId: string;
  updated: string;
};

type ResourceBundle = {
  categories: ResourceCategory[];
  items: ResourceDoc[];
};

function expandItems(base: ResourceDoc[], count: number): ResourceDoc[] {
  if (base.length >= count) return base;
  const next: ResourceDoc[] = [...base];
  let i = 1;
  while (next.length < count) {
    const src = base[(next.length - base.length) % base.length];
    next.push({
      ...src,
      id: `${src.id}-x${i}`,
      title: `${src.title} (Copy ${i})`,
      updated: src.updated,
    });
    i += 1;
  }
  return next;
}

const bundles: Record<ResourceKind, ResourceBundle> = {
  reports: {
    categories: [
      { id: 'annual', label: 'Annual Reports' },
      { id: 'performance', label: 'Performance' },
      { id: 'customer', label: 'Customer Experience' },
    ],
    items: expandItems([
      {
        id: 'rpt-2024',
        title: 'Annual Report 2024',
        summary: 'Highlights, audited results, and performance metrics.',
        type: 'pdf',
        categoryId: 'annual',
        updated: 'Jan 2025',
      },
      {
        id: 'rpt-2023',
        title: 'Annual Report 2023',
        summary: 'Service outcomes, governance, and financial overview.',
        type: 'pdf',
        categoryId: 'annual',
        updated: 'Jan 2024',
      },
      {
        id: 'perf-q3',
        title: 'Service Performance Review — Q3',
        summary: 'Monthly service coverage and continuity assessment.',
        type: 'pdf',
        categoryId: 'performance',
        updated: 'Oct 2025',
      },
      {
        id: 'perf-q2',
        title: 'Service Performance Review — Q2',
        summary: 'Key KPIs, NRW trends, and operational insights.',
        type: 'pdf',
        categoryId: 'performance',
        updated: 'Jul 2025',
      },
      {
        id: 'cust-snap',
        title: 'Customer Experience Snapshot',
        summary: 'Key insights from feedback and support metrics.',
        type: 'pdf',
        categoryId: 'customer',
        updated: 'Sep 2025',
      },
      {
        id: 'cust-brief',
        title: 'Customer Service Brief',
        summary: 'Response time trends and service quality improvements.',
        type: 'pdf',
        categoryId: 'customer',
        updated: 'May 2025',
      },
    ], 30),
  },
  tariffs: {
    categories: [
      { id: 'residential', label: 'Residential' },
      { id: 'commercial', label: 'Commercial' },
      { id: 'meter', label: 'Meter Rent' },
    ],
    items: expandItems([
      {
        id: 'tariff-res-1',
        title: 'Residential Tariff Sheet',
        summary: 'Applicable domestic rates and minimum charges.',
        type: 'pdf',
        categoryId: 'residential',
        updated: 'Mar 2025',
      },
      {
        id: 'tariff-res-2',
        title: 'Residential Block Tariffs',
        summary: 'Tiered charges and consumption thresholds.',
        type: 'xls',
        categoryId: 'residential',
        updated: 'Mar 2025',
      },
      {
        id: 'tariff-com-1',
        title: 'Commercial Tariff Sheet',
        summary: 'Rates for industrial and government customers.',
        type: 'pdf',
        categoryId: 'commercial',
        updated: 'Mar 2025',
      },
      {
        id: 'tariff-com-2',
        title: 'Bulk Supply Tariffs',
        summary: 'Special rates for bulk supply connections.',
        type: 'doc',
        categoryId: 'commercial',
        updated: 'Mar 2025',
      },
      {
        id: 'tariff-meter-1',
        title: 'Meter Rent Schedule',
        summary: 'Monthly meter rent by size.',
        type: 'pdf',
        categoryId: 'meter',
        updated: 'Mar 2025',
      },
      {
        id: 'tariff-meter-2',
        title: 'Meter Size Guide',
        summary: 'Recommended meter sizing guidelines.',
        type: 'doc',
        categoryId: 'meter',
        updated: 'Feb 2025',
      },
    ], 30),
  },
  'strategic-plan': {
    categories: [
      { id: 'strategy', label: 'Strategy' },
      { id: 'projects', label: 'Capital Projects' },
      { id: 'sustainability', label: 'Sustainability' },
    ],
    items: expandItems([
      {
        id: 'sp-2027',
        title: 'Strategic Plan 2024–2027',
        summary: 'Investment priorities and service targets.',
        type: 'pdf',
        categoryId: 'strategy',
        updated: 'Dec 2024',
      },
      {
        id: 'sp-policy',
        title: 'Strategic Priorities Brief',
        summary: 'Key focus areas and measurable outcomes.',
        type: 'doc',
        categoryId: 'strategy',
        updated: 'Dec 2024',
      },
      {
        id: 'sp-capital',
        title: 'Capital Projects Pipeline',
        summary: 'Key infrastructure delivery milestones.',
        type: 'xls',
        categoryId: 'projects',
        updated: 'Jan 2025',
      },
      {
        id: 'sp-progress',
        title: 'Project Delivery Tracker',
        summary: 'Milestone status and funding coverage.',
        type: 'xls',
        categoryId: 'projects',
        updated: 'Oct 2025',
      },
      {
        id: 'sp-sustain',
        title: 'Sustainability Initiatives',
        summary: 'Water loss reduction and energy efficiency.',
        type: 'pdf',
        categoryId: 'sustainability',
        updated: 'Feb 2025',
      },
      {
        id: 'sp-impact',
        title: 'Climate Impact Plan',
        summary: 'Resilience measures for drought and flood events.',
        type: 'pdf',
        categoryId: 'sustainability',
        updated: 'Feb 2025',
      },
    ], 30),
  },
  downloads: {
    categories: [
      { id: 'forms', label: 'Forms' },
      { id: 'guides', label: 'Guides' },
      { id: 'policies', label: 'Policies' },
    ],
    items: expandItems([
      {
        id: 'dl-conn',
        title: 'New Connection Form',
        summary: 'Apply for a new water connection.',
        type: 'doc',
        categoryId: 'forms',
        updated: 'Apr 2025',
      },
      {
        id: 'dl-adjust',
        title: 'Bill Adjustment Request',
        summary: 'Submit a billing review request.',
        type: 'doc',
        categoryId: 'forms',
        updated: 'Apr 2025',
      },
      {
        id: 'dl-relocate',
        title: 'Service Relocation Form',
        summary: 'Request service relocation or meter transfer.',
        type: 'doc',
        categoryId: 'forms',
        updated: 'Apr 2025',
      },
      {
        id: 'dl-guide',
        title: 'Customer Service Guide',
        summary: 'How to read your bill and manage usage.',
        type: 'pdf',
        categoryId: 'guides',
        updated: 'Jun 2025',
      },
      {
        id: 'dl-safety',
        title: 'Water Safety Guide',
        summary: 'Safe storage and household water practices.',
        type: 'pdf',
        categoryId: 'guides',
        updated: 'Jun 2025',
      },
      {
        id: 'dl-policy',
        title: 'Customer Service Charter',
        summary: 'Service commitments and response standards.',
        type: 'pdf',
        categoryId: 'policies',
        updated: 'Mar 2025',
      },
    ], 30),
  },
  notices: {
    categories: [
      { id: 'maintenance', label: 'Maintenance' },
      { id: 'quality', label: 'Water Quality' },
      { id: 'service', label: 'Customer Service' },
    ],
    items: expandItems([
      {
        id: 'ntc-zone3',
        title: 'Planned Maintenance: Zone 3',
        summary: 'Scheduled service interruption notice.',
        type: 'pdf',
        categoryId: 'maintenance',
        updated: 'Nov 2025',
      },
      {
        id: 'ntc-zone5',
        title: 'Pipeline Repairs: Zone 5',
        summary: 'Temporary service disruption update.',
        type: 'pdf',
        categoryId: 'maintenance',
        updated: 'Oct 2025',
      },
      {
        id: 'ntc-quality',
        title: 'Water Quality Advisory',
        summary: 'Temporary advisory and guidance.',
        type: 'pdf',
        categoryId: 'quality',
        updated: 'Sep 2025',
      },
      {
        id: 'ntc-lab',
        title: 'Lab Testing Update',
        summary: 'Routine testing results and actions.',
        type: 'pdf',
        categoryId: 'quality',
        updated: 'Aug 2025',
      },
      {
        id: 'ntc-hotline',
        title: 'Customer Service Hotline Update',
        summary: 'New contact hours and channels.',
        type: 'doc',
        categoryId: 'service',
        updated: 'Jul 2025',
      },
      {
        id: 'ntc-office',
        title: 'Office Hours Notice',
        summary: 'Updated front office hours and holiday closures.',
        type: 'doc',
        categoryId: 'service',
        updated: 'Jul 2025',
      },
    ], 30),
  },
  tenders: {
    categories: [
      { id: 'open', label: 'Open Tenders' },
      { id: 'awarded', label: 'Awarded' },
      { id: 'archived', label: 'Archived' },
    ],
    items: expandItems([
      {
        id: 'tn-001',
        title: 'Tender: Supply of HDPE Pipes',
        summary: 'Procurement for network upgrade Phase 2.',
        type: 'pdf',
        categoryId: 'open',
        updated: 'Feb 2026',
      },
      {
        id: 'tn-002',
        title: 'Tender: Meter Installation Services',
        summary: 'Framework for meter replacement in priority zones.',
        type: 'pdf',
        categoryId: 'open',
        updated: 'Feb 2026',
      },
      {
        id: 'tn-003',
        title: 'Tender: Laboratory Consumables',
        summary: 'Water quality testing supplies for 12 months.',
        type: 'doc',
        categoryId: 'open',
        updated: 'Jan 2026',
      },
      {
        id: 'tn-004',
        title: 'Award: Pump Station Upgrade',
        summary: 'Awarded to AquaTech Engineering Ltd.',
        type: 'pdf',
        categoryId: 'awarded',
        updated: 'Dec 2025',
      },
      {
        id: 'tn-005',
        title: 'Award: Sewer Line Rehabilitation',
        summary: 'Awarded to HydroWorks Contractors.',
        type: 'pdf',
        categoryId: 'awarded',
        updated: 'Nov 2025',
      },
      {
        id: 'tn-006',
        title: 'Archived: Fleet Maintenance Services',
        summary: 'Closed procurement for fleet servicing.',
        type: 'doc',
        categoryId: 'archived',
        updated: 'Sep 2025',
      },
    ], 30),
  },
};

export function getResourceBundle(kind: ResourceKind): ResourceBundle {
  return bundles[kind];
}

export function getPaginatedResources(
  kind: ResourceKind,
  categoryId: string | undefined,
  page: number,
  pageSize: number,
): {
  items: ResourceDoc[];
  total: number;
  totalPages: number;
  page: number;
  categories: ResourceCategory[];
} {
  const bundle = getResourceBundle(kind);
  const filtered = categoryId
    ? bundle.items.filter((item) => item.categoryId === categoryId)
    : bundle.items;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return {
    items,
    total,
    totalPages,
    page: safePage,
    categories: bundle.categories,
  };
}
