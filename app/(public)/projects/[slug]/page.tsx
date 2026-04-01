import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

import { getProjectBySlug, getProjects } from '@/lib/data/public/projects/getters';
import { RichContent } from '@/components/reusables/rich-text/HtmlContent';
import styles from '@/components/public/projects/projects.module.css';
import { cn } from '@/lib/utils';
import { projectDetailJsonLd } from '@/components/seo/projects-jsonld';
import { absUrl } from '@/lib/seo/origin.server';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return generatePageMetadata({
      title: `Project Not Found | ${SITE.shortName}`,
      description: 'The requested project was not found.',
      path: `/projects/${slug}`,
      type: 'website',
    });
  }

  return generatePageMetadata({
    title: `${project.title} | Projects | ${SITE.shortName}`,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
    image: project.heroImage,
    type: 'article',
    modifiedTime: project.updatedAt || undefined,
    section: 'Projects',
    tags: [project.status],
  });
}

async function ProjectDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getProjects()]);

  if (!project) return notFound();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Projects', item: '/projects' },
    { name: project.title, item: `/projects/${project.slug}` },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);
  const relatedItems = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 4)
    .map((item, index) => ({
      name: item.title,
      url: `/projects/${item.slug}`,
      position: index + 1,
    }));

  return (
    <>
      <PageSeo
        title={`${project.title} | Projects | ${SITE.shortName}`}
        description={project.shortDescription}
        path={`/projects/${project.slug}`}
        type="article"
        breadcrumbItems={breadcrumbItems}
        itemListProps={{
          name: 'Other projects',
          description: 'Additional water and sanitation projects.',
          url: '/projects',
          items: relatedItems,
        }}
      />

      <JsonLd
        data={projectDetailJsonLd({
          url: absUrl(`/projects/${project.slug}`),
          name: project.title,
          description: project.shortDescription,
          image: project.heroImage,
          status: project.status,
        })}
      />

      <Breadcrumb pageTitle={project.title} items={breadcrumbLinks} />

      <Section padding="lg">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <div className={styles.detailHero}>
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  width={640}
                  height={520}
                  className="img-fluid"
                  priority
                />
              </div>
            </div>
            <div className="col-lg-7">
              <span
                className={cn(
                  styles.cardBadge,
                  project.status === 'completed' && styles.cardBadgeCompleted,
                )}
              >
                {project.status}
              </span>
              <h1 className={styles.detailTitle}>{project.title}</h1>
              <RichContent html={project.content} />

              <div className="mt-4">
                <Link href="/projects" className="btn btn-outline-primary">
                  Back to Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function ProjectDetailPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading project…</div>}>
        <ProjectDetailContent {...props} />
      </Suspense>
    </main>
  );
}
