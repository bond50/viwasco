// lib/cache/tags.ts
// Single source of truth for cache tags

// ----- Organization settings tags -----
export const ORG_ORGANIZATION_TAG = 'org-organization';
export const ORG_BASIC_TAG = 'org-basic';
export const ORG_INTRO_TAG = 'org-introduction';
export const ORG_VISION_MISSION_TAG = 'org-vision-mission';
export const ORG_CORE_VALUES_HEADER_TAG = 'org-core-core-values-header';
export const ORG_CONTACT_TAG = 'org-contact';
export const ORG_LEGAL_TAG = 'org-legal';
export const ORG_SOCIAL_HOURS_TAG = 'org-social-hours';
export const ORG_ADMIN_ACCESS_TAG = 'ORG_ADMIN_ACCESS'; // existing
export const ORG_HERO_TAG = 'org-hero';
export const SERVICE_CATEGORIES_TAG = 'about-service-categories';
export const SERVICES_TAG = 'about-services';
export const PROJECTS_TAG = 'projects';
export const PROJECT_CATEGORIES_TAG = 'project-categories';
// Public About nav aggregate
export const ABOUT_NAV_TAG = 'about';

// Convenience bundle for “invalidate everything Organization”
export const ORG_ALL_TAGS: readonly string[] = [
  ORG_ORGANIZATION_TAG,
  ORG_BASIC_TAG,
  ORG_INTRO_TAG,
  ORG_VISION_MISSION_TAG,
  ORG_CORE_VALUES_HEADER_TAG,
  ORG_CONTACT_TAG,
  ORG_LEGAL_TAG,
  ORG_SOCIAL_HOURS_TAG,
  ORG_ADMIN_ACCESS_TAG,
  ORG_HERO_TAG,
  ABOUT_NAV_TAG, // nav often reflects org state
] as const;

// ----- About content tags -----
export const ABOUT_VALUES_TAG = 'about-core-values';
export const ABOUT_METRICS_TAG = 'about-metrics';
export const ABOUT_MILESTONES_TAG = 'about-milestones';
export const ABOUT_FAQS_TAG = 'about-faqs';
export const ABOUT_AWARDS_TAG = 'about-awards';
export const ABOUT_CERTS_TAG = 'about-certs';
export const ABOUT_TESTIMONIALS_TAG = 'about-testimonials';
export const ABOUT_PARTNERS_TAG = 'about-partners';
export const ABOUT_LEADERSHIP_CATS_TAG = 'about-leadership-cats';
export const ABOUT_LEADERSHIP_TEAM_TAG = 'about-leadership-team';
export const ABOUT_MESSAGES_TAG = 'about-messages';
export const ABOUT_DOC_CATS_TAG = 'about-doc-cats';
export const ABOUT_DOCS_TAG = 'about-docs';
export const RESOURCES_TAG = 'resources';
export const RESOURCE_KINDS_TAG = 'resource-kinds';
export const RESOURCE_CATEGORIES_TAG = 'resource-categories';
export const TENDERS_TAG = 'tenders';
export const CAREERS_TAG = 'careers';
export const CAREER_TYPES_TAG = 'career-types';
export const NEWSLETTERS_TAG = 'newsletters';
export const NEWSLETTER_CATEGORIES_TAG = 'newsletter-categories';
export const NEWS_TAG = 'news';
export const NEWS_CATEGORIES_TAG = 'news-categories';
export const CONTACT_MESSAGES_TAG = 'contact-messages';

// Convenience bundle for “invalidate everything About”
export const ABOUT_ALL_TAGS: readonly string[] = [
  ABOUT_NAV_TAG,
  ABOUT_VALUES_TAG,
  ABOUT_METRICS_TAG,
  ABOUT_MILESTONES_TAG,
  ABOUT_FAQS_TAG,
  ABOUT_AWARDS_TAG,
  ABOUT_CERTS_TAG,
  ABOUT_TESTIMONIALS_TAG,
  ABOUT_PARTNERS_TAG,
  ABOUT_LEADERSHIP_CATS_TAG,
  ABOUT_LEADERSHIP_TEAM_TAG,
  ABOUT_MESSAGES_TAG,
  ABOUT_DOC_CATS_TAG,
  ABOUT_DOCS_TAG,
] as const;
