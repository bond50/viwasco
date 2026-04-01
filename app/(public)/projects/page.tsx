import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';

import { getPaginatedProjects, type ProjectStatus } from '@/lib/data/public/projects/getters';
import styles from '@/components/public/projects/projects.module.css';
import { cn } from '@/lib/utils';
import { projectDetailJsonLd } from '@/components/seo/projects-jsonld';
import { absUrl } from '@/lib/seo/origin.server';

type PageProps = {
  searchParams?: Promise<{ status?: string; page?: string }>;
};

const FILTERS: { label: string; value?: ProjectStatus }[] = [
  { label: 'All' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const statusParam = params.status;
  const status =
    statusParam === 'ongoing' || statusParam === 'completed'
      ? (statusParam as ProjectStatus)
      : undefined;
  const { items } = await getPaginatedProjects(status, 1, 1);
  const first = items[0];
  const filterLabel = FILTERS.find((filter) => filter.value === status)?.label;

  return generatePageMetadata({
    title: filterLabel
      ? `${filterLabel} Projects | ${SITE.shortName}`
      : `Projects | ${SITE.shortName}`,
    description:
      first?.shortDescription || 'Track ongoing and completed water and sanitation projects.',
    path: '/projects',
    image: first?.heroImage,
    type: 'website',
  });
}

async function ProjectsContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const statusParam = params.status;
  const pageParam = params.page;
  const status =
    statusParam === 'ongoing' || statusParam === 'completed'
      ? (statusParam as ProjectStatus)
      : undefined;

  const pageSize = 9;
  const page = pageParam ? Number(pageParam) : 1;
  const {
    items,
    totalPages,
    page: safePage,
  } = await getPaginatedProjects(status, Number.isFinite(page) ? page : 1, pageSize);

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Projects', item: '/projects' },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);
  const seoItems = items.slice(0, 8).map((project, index) => ({
    name: project.title,
    url: `/projects/${project.slug}`,
    position: index + 1,
  }));

  return (
    <>
      <PageSeo
        title={`Projects | ${SITE.shortName}`}
        description={
          items[0]?.shortDescription || 'Track ongoing and completed water and sanitation projects.'
        }
        path="/projects"
        type="website"
        breadcrumbItems={breadcrumbItems}
        itemListProps={{
          name: 'Project portfolio',
          description: 'Ongoing and completed water and sanitation projects.',
          url: '/projects',
          items: seoItems,
        }}
      />

      <Breadcrumb pageTitle="Projects" items={breadcrumbLinks} />

      <Section background="light" padding="lg">
        <div className="container">
          <div className={styles.filterBar}>
            <div>
              <h2 className="page-hero-title mb-1">Project Portfolio</h2>
              <p className="page-hero-text mb-0">Browse our ongoing and completed initiatives.</p>
            </div>
            <div className={styles.filterGroup}>
              {FILTERS.map((filter) => {
                const href = filter.value ? `/projects?status=${filter.value}` : '/projects';
                const isActive = filter.value ? filter.value === status : !status;
                return (
                  <Link
                    key={filter.label}
                    href={href}
                    className={cn(styles.filterButton, isActive && styles.filterButtonActive)}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section padding="lg">
        <div className="container">
          <div className={styles.cardGrid}>
            {items.length > 0 ? (
              items.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={styles.projectCard}
                >
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    width={640}
                    height={420}
                    className={styles.cardImage}
                    sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className={styles.cardBody}>
                    <span
                      className={cn(
                        styles.cardBadge,
                        project.status === 'completed' && styles.cardBadgeCompleted,
                      )}
                    >
                      {project.status}
                    </span>
                    <div className={styles.cardTitle}>{project.title}</div>
                    <p className="text-muted mb-0">{project.shortDescription}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="alert alert-info mb-0">No projects have been published yet.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Link
                href={
                  safePage > 1
                    ? `/projects?${new URLSearchParams({
                        ...(status ? { status } : {}),
                        page: String(safePage - 1),
                      }).toString()}`
                    : '#'
                }
                className={cn(styles.pageLink, safePage === 1 && styles.pageLinkDisabled)}
                aria-disabled={safePage === 1}
              >
                Previous
              </Link>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={`/projects?${new URLSearchParams({
                      ...(status ? { status } : {}),
                      page: String(n),
                    }).toString()}`}
                    className={cn(styles.pageNumber, n === safePage && styles.pageNumberActive)}
                  >
                    {n}
                  </Link>
                ))}
              </div>

              <Link
                href={
                  safePage < totalPages
                    ? `/projects?${new URLSearchParams({
                        ...(status ? { status } : {}),
                        page: String(safePage + 1),
                      }).toString()}`
                    : '#'
                }
                className={cn(styles.pageLink, safePage === totalPages && styles.pageLinkDisabled)}
                aria-disabled={safePage === totalPages}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </Section>

      {items[0] && (
        <JsonLd
          data={projectDetailJsonLd({
            url: absUrl(`/projects/${items[0].slug}`),
            name: items[0].title,
            description: items[0].shortDescription,
            image: items[0].heroImage,
            status: items[0].status,
          })}
        />
      )}
    </>
  );
}

export default function ProjectsPage(props: PageProps) {
  return (
    <main>
      <Suspense fallback={<div className="p-6">Loading projects…</div>}>
        <ProjectsContent {...props} />
      </Suspense>
    </main>
  );
}
