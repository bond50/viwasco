// lib/seo/config.ts

export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: 'Water & Sanitation Utility' | string;
  url: string; // absolute, with scheme
  locale: string; // e.g. en_KE
  defaultOg: string; // absolute or root-relative
  logo: {
    light: string;
    dark?: string;
    square?: string;
  };
  social: {
    twitter?: string; // handle or full profile URL
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  contacts: {
    email: string;
    phone?: string;
    hotline?: string;
    whatsapp?: string;
    address?: string;
    geo?: { lat: number; lng: number };
    hours?: string;
  };
  customer: {
    portalUrl?: string;
    ussd?: string;
    paybill?: string;
    accountHint?: string;
    reportLeakUrl?: string;
    outagesUrl?: string;
    tariffsUrl?: string;
    tendersUrl?: string;
    downloadsUrl?: string;
    faqUrl?: string;
  };
  serviceAreas: string[];
};

// ---------- helpers (local to this module) ----------
const env = (k: string, d = '') => process.env[k] ?? d;

const parseNumber = (v: string, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseList = (csv: string) =>
  csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const normalizeTwitterHandle = (value?: string) => {
  if (!value) return undefined;
  const v = value.trim();
  if (!v) return undefined;
  // Accept handle ("@viwasco") or URL ("https://twitter.com/viwasco")
  if (v.startsWith('http')) return v;
  return v.startsWith('@') ? v : `@${v}`;
};

// ---------- site config ----------
export const SITE: SiteConfig = {
  name: env('NEXT_PUBLIC_APP_NAME', 'Vihiga Water and Sanitation Company'),
  shortName: env('NEXT_PUBLIC_COMPANY_SHORTNAME', 'VIWASCO'),
  tagline: env(
    'NEXT_PUBLIC_TAGLINE',
    'Safe, reliable water and sanitation services for our community.',
  ),
  description: env(
    'NEXT_PUBLIC_META_DESCRIPTION',
    'Official website for a county water & sanitation utility: pay your bill, report leaks & bursts, check planned/unplanned outages, view tariffs, tenders, water quality reports, and customer resources.',
  ),
  category: 'Water & Sanitation Utility',
  url: env('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  locale: env('NEXT_PUBLIC_LOCALE', 'en_KE'),
  defaultOg: env('NEXT_PUBLIC_OG_DEFAULT', '/og-default.png'),
  logo: {
    light: env('NEXT_PUBLIC_LOGO_LIGHT', '/brand/logo-light.svg'),
    dark: env('NEXT_PUBLIC_LOGO_DARK', '/brand/logo-dark.svg'),
    square: env('NEXT_PUBLIC_LOGO_SQUARE', '/brand/logo-square.png'),
  },
  social: {
    twitter: normalizeTwitterHandle(env('NEXT_PUBLIC_TWITTER', '')),
    facebook: env('NEXT_PUBLIC_FACEBOOK', ''),
    linkedin: env('NEXT_PUBLIC_LINKEDIN', ''),
    youtube: env('NEXT_PUBLIC_YOUTUBE', ''),
    instagram: env('NEXT_PUBLIC_INSTAGRAM', ''),
  },
  contacts: {
    email: env('NEXT_PUBLIC_SUPPORT_EMAIL', 'support@example.com'),
    phone: env('NEXT_PUBLIC_SUPPORT_PHONE', '+254700000000'),
    hotline: env('NEXT_PUBLIC_HOTLINE', '+254711000000'),
    whatsapp: env('NEXT_PUBLIC_WHATSAPP', ''),
    address: env('NEXT_PUBLIC_POSTAL_ADDRESS', 'P.O. Box 123, Main Town, Kenya'),
    geo: {
      lat: parseNumber(env('NEXT_PUBLIC_OFFICE_LAT', '-0.023559'), -0.023559),
      lng: parseNumber(env('NEXT_PUBLIC_OFFICE_LNG', '37.906193'), 37.906193),
    },
    hours: env('NEXT_PUBLIC_OFFICE_HOURS', 'Mon–Fri 8:00–17:00 EAT'),
  },
  customer: {
    portalUrl: env('NEXT_PUBLIC_CUSTOMER_PORTAL_URL', ''),
    ussd: env('NEXT_PUBLIC_USSD_CODE', '*123#'),
    paybill: env('NEXT_PUBLIC_PAYBILL', '123456'),
    accountHint: env('NEXT_PUBLIC_ACCOUNT_NO_HINT', 'Use your water account number'),
    reportLeakUrl: env('NEXT_PUBLIC_REPORT_LEAK_URL', '/report-leak'),
    outagesUrl: env('NEXT_PUBLIC_OUTAGES_URL', '/service-updates'),
    tariffsUrl: env('NEXT_PUBLIC_TARIFFS_URL', '/tariffs'),
    tendersUrl: env('NEXT_PUBLIC_TENDERS_URL', '/tenders'),
    downloadsUrl: env('NEXT_PUBLIC_DOWNLOADS_URL', '/downloads'),
    faqUrl: env('NEXT_PUBLIC_FAQ_URL', '/faq'),
  },
  serviceAreas: parseList(env('NEXT_PUBLIC_SERVICE_AREAS', 'Main Town, Ward A, Ward B')),
};
