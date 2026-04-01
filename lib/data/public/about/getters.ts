// lib/data/public/about.ts
import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import {
  ABOUT_AWARDS_TAG,
  ABOUT_CERTS_TAG,
  ABOUT_DOC_CATS_TAG,
  ABOUT_FAQS_TAG,
  ABOUT_LEADERSHIP_CATS_TAG,
  ABOUT_LEADERSHIP_TEAM_TAG,
  ABOUT_MESSAGES_TAG,
  ABOUT_METRICS_TAG,
  ABOUT_MILESTONES_TAG,
  ABOUT_NAV_TAG,
  ABOUT_PARTNERS_TAG,
  ABOUT_TESTIMONIALS_TAG,
  ABOUT_VALUES_TAG,
  ORG_ORGANIZATION_TAG,
} from '@/lib/cache/tags';
import { ensureUploadedImageStrict } from '@/lib/assets/core';
import { coerceJsonToRawLinks, processSocialLinks } from '@/lib/social-links';
import { CategoryWithActiveMembers } from '@/lib/types/about/management';
import { SocialLink } from '@/lib/schemas/shared/social';
import { EducationLevel, LeadershipCategoryType } from '@/generated/prisma/client';
import { workingHoursTopbarLabel } from '@/lib/working-hours';

/**Types*/
export type TeamEducationItem = {
  id: string;
  institution: string;
  qualification: string | null;
  level: EducationLevel | null;
  field: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  honor: string | null;
  logo: ReturnType<typeof ensureUploadedImageStrict> | null;
  rank: number;
};

export type TeamExperienceItem = {
  id: string;
  organization: string;
  role: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isCurrent: boolean;
  logo: ReturnType<typeof ensureUploadedImageStrict> | null;
  achievements: string[];
  rank: number;
};

export type TeamAchievementItem = {
  id: string;
  title: string;
  issuer: string | null;
  year: number | null;
  description: string | null;
  logo: ReturnType<typeof ensureUploadedImageStrict> | null;
  rank: number;
};

export type TeamPublicationItem = {
  id: string;
  title: string;
  publisher: string | null;
  year: number | null;
  url: string | null;
  description: string | null;
  logo: ReturnType<typeof ensureUploadedImageStrict> | null;
  rank: number;
};


/** Types */
export type ActiveTeamMemberWithRelated = {
  member: {
    id: string;
    name: string;
    slug: string;
    position: string;
    bio: string | null;
    image: ReturnType<typeof ensureUploadedImageStrict>;
    socialLinks: SocialLink[];
    isFeatured: boolean;

    email: string | null;
    phone: string | null;
    expertiseArea: string | null;
    officeLocation: string | null;

    showEmail: boolean;
    showPhone: boolean;
    showSocialLinks: boolean;
    allowContact: boolean;

 
    educationItems: TeamEducationItem[];
    experienceItems: TeamExperienceItem[];
    achievementItems: TeamAchievementItem[];
    publicationItems: TeamPublicationItem[];

    officeHours: string | null;
    assistantContact: string | null;

    languages: string[];
    boardCommittees: string[];
    professionalAffiliations: string[];
    awards: string[];

    publications: unknown | null;
    metadata: unknown | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categoryType: LeadershipCategoryType;
  };
  related: {
    id: string;
    name: string;
    slug: string;
    position: string;
    bio: string | null;
    image: ReturnType<typeof ensureUploadedImageStrict>;
    isFeatured: boolean;
  }[];
  message: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    updatedAt: Date;
  } | null;
};
export interface TeamMessage {
   id: string;
    title: string;
    excerpt: string;
    body: string;
    updatedAt: Date;
}
export const getActiveTeamMemberWithRelated = async (
  slug: string,
): Promise<ActiveTeamMemberWithRelated | null> => {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);
  cacheTag(ABOUT_MESSAGES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  const raw = await db.managementTeam.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      position: true,
      bio: true,
      image: true,
      slug: true,
      rank: true,
      isFeatured: true,
      socialLinks: true,
      isActive: true,

      email: true,
      phone: true,
      expertiseArea: true,
      officeLocation: true,

      showEmail: true,
      showPhone: true,
      showSocialLinks: true,
      allowContact: true,

      experience: true,
      achievements: true,
      workingHours: true,
      assistantContact: true,

      languages: true,
      boardCommittees: true,
      professionalAffiliations: true,
      awards: true,

      publications: true,
      metadata: true,

      // 🔹 Relational: education
      educations: {
        orderBy: { rank: 'asc' },
        select: {
          id: true,
          institution: true,
          qualification: true,
          level: true,
          field: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          description: true,
          honor: true,
          logo: true,
          rank: true,
        },
      },

      // 🔹 Relational: experience
      TeamExperience: {
        orderBy: { rank: 'asc' },
        select: {
          id: true,
          organization: true,
          role: true,
          description: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          logo: true,
          achievements: true,
          rank: true,
        },
      },

      // 🔹 Relational: achievements
      TeamAchievement: {
        orderBy: { rank: 'asc' },
        select: {
          id: true,
          title: true,
          issuer: true,
          year: true,
          description: true,
          logo: true,
          rank: true,
        },
      },

      // 🔹 Relational: publications
      TeamPublication: {
        orderBy: { rank: 'asc' },
        select: {
          id: true,
          title: true,
          publisher: true,
          year: true,
          url: true,
          description: true,
          logo: true,
          rank: true,
        },
      },

      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          categoryType: true,
        },
      },
      OrganizationMessage: {
        where: { published: true },
        orderBy: { updatedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          title: true,
          body: true,
          excerpt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!raw) {
    return null;
  }

  const rawLinks = coerceJsonToRawLinks(raw.socialLinks);
  const processedLinks = processSocialLinks(rawLinks);

  // 🔹 Normalise relational items
  const educationItems: TeamEducationItem[] = raw.educations.map((e) => ({
    id: e.id,
    institution: e.institution,
    qualification: e.qualification ?? null,
    level: e.level ?? null,
    field: e.field ?? null,
    startDate: e.startDate ?? null,
    endDate: e.endDate ?? null,
    isCurrent: e.isCurrent ?? false,
    description: e.description ?? null,
    honor: e.honor ?? null,
    logo: e.logo ? ensureUploadedImageStrict(e.logo) : null,
    rank: e.rank,
  }));

  const experienceItems: TeamExperienceItem[] = raw.TeamExperience.map((x) => ({
    id: x.id,
    organization: x.organization,
    role: x.role,
    description: x.description ?? null,
    startDate: x.startDate ?? null,
    endDate: x.endDate ?? null,
    isCurrent: x.isCurrent ?? false,
    logo: x.logo ? ensureUploadedImageStrict(x.logo) : null,
    achievements: x.achievements ?? [],
    rank: x.rank,
  }));

  const achievementItems: TeamAchievementItem[] = raw.TeamAchievement.map((x) => ({
    id: x.id,
    title: x.title,
    issuer: x.issuer ?? null,
    year: x.year ?? null,
    description: x.description ?? null,
    logo: x.logo ? ensureUploadedImageStrict(x.logo) : null,
    rank: x.rank,
  }));

  const publicationItemsFromRel: TeamPublicationItem[] = raw.TeamPublication.map((x) => ({
    id: x.id,
    title: x.title,
    publisher: x.publisher ?? null,
    year: x.year ?? null,
    url: x.url ?? null,
    description: x.description ?? null,
    logo: x.logo ? ensureUploadedImageStrict(x.logo) : null,
    rank: x.rank,
  }));

  // 🔹 Legacy JSON publications fallback (if no relational rows yet)
  let publicationItems: TeamPublicationItem[] = publicationItemsFromRel;
  if (publicationItems.length === 0 && Array.isArray(raw.publications)) {
    publicationItems = (raw.publications as unknown[]).map((p, index) => {
      const obj = p as { [key: string]: unknown };
      return {
        id: String(obj.id ?? index),
        title: String(obj.title ?? 'Untitled'),
        publisher: (obj.publisher as string | undefined) ?? null,
        year: (obj.year as number | undefined) ?? null,
        url: (obj.url as string | undefined) ?? null,
        description: (obj.description as string | undefined) ?? null,
        logo: null,
        rank: index + 1,
      };
    });
  }

  const member: ActiveTeamMemberWithRelated['member'] = {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    position: raw.position,
    bio: raw.bio ?? null,
    image: ensureUploadedImageStrict(raw.image),
    socialLinks: processedLinks as SocialLink[],
    isFeatured: raw.isFeatured,

    email: raw.email ?? null,
    phone: raw.phone ?? null,
    expertiseArea: raw.expertiseArea ?? null,
    officeLocation: raw.officeLocation ?? null,

    showEmail: raw.showEmail,
    showPhone: raw.showPhone,
    showSocialLinks: raw.showSocialLinks,
    allowContact: raw.allowContact,


    // Relational items
    educationItems,
    experienceItems,
    achievementItems,
    publicationItems,

    officeHours: workingHoursTopbarLabel(raw.workingHours),
    assistantContact: raw.assistantContact ?? null,

    languages: raw.languages ?? [],
    boardCommittees: raw.boardCommittees ?? [],
    professionalAffiliations: raw.professionalAffiliations ?? [],
    awards: raw.awards ?? [],

    publications: raw.publications ?? null,
    metadata: raw.metadata ?? null,
  };

  const category: ActiveTeamMemberWithRelated['category'] = {
    id: raw.category.id,
    name: raw.category.name,
    slug: raw.category.slug,
    description: raw.category.description ?? null,
    categoryType: raw.category.categoryType,
  };

  const message =
    raw.OrganizationMessage.length > 0
      ? {
          id: raw.OrganizationMessage[0].id,
          title: raw.OrganizationMessage[0].title,
          excerpt: raw.OrganizationMessage[0].excerpt,
          body: raw.OrganizationMessage[0].body,
          updatedAt: raw.OrganizationMessage[0].updatedAt,
        }
      : null;

  const relatedRaw = await db.managementTeam.findMany({
    where: {
      isActive: true,
      categoryId: raw.categoryId,
      NOT: { id: raw.id },
    },
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      position: true,
      bio: true,
      image: true,
      slug: true,
      isFeatured: true,
    },
  });

  const related: ActiveTeamMemberWithRelated['related'] = relatedRaw.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    position: r.position,
    bio: r.bio,
    image: ensureUploadedImageStrict(r.image),
    isFeatured: r.isFeatured,
  }));

  return {
    member,
    category,
    related,
    message,
  };
};


/** Organization Overview */
export async function getOrganizationOverview() {
  'use cache';
  cacheLife('days');
  cacheTag(ORG_ORGANIZATION_TAG);
  cacheTag(ABOUT_NAV_TAG);

  // Single org app → pick the first (or constrain by slug if you add one)
  return db.organization.findFirst({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      tagline: true,
      shortName: true,
      introTitle: true,
      introDescription: true,
      vision: true,
      mission: true,
      missionIcon: true,
      visionIcon: true,
      coreValuesLeadText: true,
      logo: true,
      featuredImage: true,
      bannerImage: true,
      coreValuesImage: true,
        introImage: true,
        websiteUrl: true,
        contactEmail: true,
        phone: true,
        address: true,
        footerAboutText: true,
        customerPortalEnabled: true,
        customerPortalLabel: true,
        customerPortalUrl: true,
        serviceCentres: true,
        socialLinks: true,
        workingHours: true,
      regulatorName: true,
      licenseNumber: true,
      licenseExpiry: true,
      customerCareHotline: true,
      whatsappNumber: true,
      isActive: true,
      isVerified: true,
      isFeatured: true,
      metadata: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

/** Leadership — Team (active only) */
export async function getLeadershipTeam() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_LEADERSHIP_TEAM_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.managementTeam.findMany({
    where: { isActive: true },
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      position: true,
      bio: true,
      image: true,
      slug: true,
      rank: true,
      isFeatured: true,
      socialLinks: true,
      category: {
        select: { id: true, name: true, slug: true, categoryType: true },
      },
    },
  });
}

export const getTeamCategoriesWithActiveMembers = async (): Promise<CategoryWithActiveMembers[]> => {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);
  try {
    const raw = await db.managementCategory.findMany({
      orderBy: [{ rank: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        rank: true,
        categoryType: true,
        teamMembers: {
          where: { isActive: true },
          orderBy: { rank: 'asc' },
          select: {
            id: true,
            name: true,
            position: true,
            bio: true,
            image: true,
            slug: true,
            socialLinks: true,
            isFeatured: true,
          },
        },
      },
    });



    return raw
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        rank: category.rank,
        categoryType: category.categoryType,
        teamMembers: category.teamMembers.map((member) => {
          const rawLinks = coerceJsonToRawLinks(member.socialLinks);
          const processed = processSocialLinks(rawLinks);

          return {
            id: member.id,
            name: member.name,
            position: member.position,
            bio: member.bio ?? '',
            slug: member.slug,
            image: ensureUploadedImageStrict(member.image),
            socialLinks: processed as SocialLink[],
            isFeatured: member.isFeatured ?? false,
          };
        }),
      }))
      .filter((category) => category.teamMembers.length > 0);
  } catch (error) {
    console.error('Error in getTeamCategoriesWithActiveMembers:', error);
    return [];
  }
};

/** Leadership — Categories */
export async function getLeadershipCategories() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_LEADERSHIP_CATS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.managementCategory.findMany({
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rank: true,
      categoryType: true,
    },
  });
}

/** Leadership — Message (latest published) */
export async function getLeadershipMessage() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_MESSAGES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationMessage.findFirst({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      body: true,
      excerpt: true,
      published: true,
      updatedAt: true,
      authorTeam: {
        select: { id: true, name: true, position: true, image: true, slug: true },
      },
    },
  });
}


// LEADERSHIP MESSAGES

export async function getLeadershipMessages() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_MESSAGES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationMessage.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      body: true,
      excerpt: true,
      updatedAt: true,
      authorTeam: {
        select: {
          id: true,
          name: true,
          position: true,
          slug: true,
          image: true,
        },
      },
    },
  });
}

// We resolve by the author team slug – one messages per leader
export async function getLeadershipMessageBySlug(slug: string) {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_MESSAGES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationMessage.findFirst({
    where: {
      published: true,
      authorTeam: {
        slug,
      },
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      body: true,
      excerpt: true,
      updatedAt: true,
      authorTeam: {
        select: {
          id: true,
          name: true,
          position: true,
          slug: true,
          image: true,
        },
      },
    },
  });
}

/** Core Values */
export async function getValues() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_VALUES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationValue.findMany({
    orderBy: [{ rank: 'asc' }, { title: 'asc' }],
    select: { id: true, title: true, description: true, icon: true, rank: true },
  });
}

/** Metrics (published) */
export async function getMetrics() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_METRICS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationMetric.findMany({
    where: { published: true },
    orderBy: [{ rank: 'asc' }, { label: 'asc' }],
    select: { id: true, label: true, value: true, unit: true, icon: true, rank: true },
  });
}

/** Milestones (timeline) */
export async function getMilestones() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_MILESTONES_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationMilestone.findMany({
    orderBy: [{ rank: 'asc' }, { date: 'desc' }],
    select: {
      id: true,
      year: true,
      date: true,
      title: true,
      summary: true,
      image: true,
      rank: true,
    },
  });
}

/** FAQs (published) */
export async function getFaqs() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_FAQS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationFaq.findMany({
    where: { published: true },
    orderBy: [{ rank: 'asc' }, { question: 'asc' }],
    select: { id: true, question: true, answer: true, rank: true },
  });
}

/** Awards */
export async function getAwards() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_AWARDS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationAward.findMany({
    orderBy: [{ rank: 'asc' }, { date: 'desc' }],
    select: {
      id: true,
      title: true,
      issuer: true,
      date: true,
      summary: true,
      badge: true,
      rank: true,
    },
  });
}

/** Certifications */
export async function getCertifications() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_CERTS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationCertification.findMany({
    orderBy: [{ rank: 'asc' }, { issueDate: 'desc' }],
    select: {
      id: true,
      name: true,
      issuingAuthority: true,
      issueDate: true,
      expiryDate: true,
      certificateFile: true,
      rank: true,
    },
  });
}

/** Testimonials (published) */
export async function getTestimonials() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_TESTIMONIALS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationTestimonial.findMany({
    where: { published: true },
    orderBy: [{ rank: 'asc' }, { authorName: 'asc' }],
    select: {
      id: true,
      authorName: true,
      authorRole: true,
      message: true,
      avatar: true,
      rank: true,
    },
  });
}

/** Partners (active) */
export async function getPartners() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_PARTNERS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.partner.findMany({
    where: { isActive: true },
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true,
      website: true,
      partnershipType: true,
      rank: true,
      isActive: true,
    },
  });
}

/** Documents (published) */
export async function getDocuments() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_DOC_CATS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationDocument.findMany({
    where: { published: true },
    orderBy: [{ rank: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      file: true,
      rank: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

/** Document Categories with at least one published doc */
export async function listDocumentCategories() {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_DOC_CATS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.documentCategory.findMany({
    where: { isActive: true, documents: { some: { published: true } } },
    orderBy: [{ rank: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, slug: true, description: true, rank: true },
  });
}

/** Documents by category slug (published) */
export async function getDocumentsByCategorySlug(slug: string) {
  'use cache';
  cacheLife('weeks');
  cacheTag(ABOUT_DOC_CATS_TAG);
  cacheTag(ABOUT_NAV_TAG);

  return db.organizationDocument.findMany({
    where: { published: true, category: { slug } },
    orderBy: [{ rank: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      file: true,
      rank: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

