import Link from 'next/link';
import { FiBriefcase } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import careerStyles from './careers.module.css';
import styles from '@/components/public/resources/resources.module.css';
import { type CareerType, getPaginatedCareers } from '@/lib/data/public/careers/getters';

type Props = {
  title: string;
  description: string;
  path: string;
  searchParams?: Promise<{ type?: string; page?: string }>;
};

export async function CareerListContent({ title, description, path, searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const typeParam = params.type;
  const pageParam = params.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 6;
  const { items, totalPages, page: safePage, types } = await getPaginatedCareers(
    typeParam || undefined,
    Number.isFinite(page) ? page : 1,
    pageSize,
  );

  return (
    <>
      <div className={styles.resourcesHeader}>
        <div>
          <h2 className="mb-2">{title}</h2>
          <p className="text-muted mb-0">{description}</p>
          <div className={careerStyles.careerSummary}>Showing {items.length} roles · Updated weekly</div>
        </div>
        <div className={styles.filterChips}>
          <Link href={path} className={cn(styles.chip, !typeParam && styles.chipActive)}>
            All
          </Link>
          {types.map((item: CareerType) => (
            <Link
              key={item.id}
              href={`${path}?type=${encodeURIComponent(item.slug)}`}
              className={cn(styles.chip, typeParam === item.slug && styles.chipActive)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {items.length > 0 ? (
          items.map((job) => (
            <div key={job.id} className={cn(styles.listItem, careerStyles.jobItem)}>
              <div className={styles.listIcon}>
                <FiBriefcase />
              </div>
              <div className={styles.listMeta}>
                <div className={careerStyles.titleRow}>
                  <h4>{job.title}</h4>
                </div>
                <div className={careerStyles.metaPills}>
                  <span className={careerStyles.metaPill}>{job.department}</span>
                  <span className={careerStyles.metaPill}>{job.type}</span>
                  <span className={careerStyles.metaPill}>{job.location}</span>
                  <span className={careerStyles.metaPill}>Closing: {job.closingDate || 'TBA'}</span>
                </div>
              </div>
              <div className={careerStyles.jobActions}>
                <a className={careerStyles.actionPrimary} href={job.pdfUrl} target="_blank" rel="noreferrer">
                  View application
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info mb-0">
            No vacancies are currently published.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Link
            href={
              safePage > 1
                ? `${path}?${new URLSearchParams({ ...(typeParam ? { type: typeParam } : {}), page: String(safePage - 1) }).toString()}`
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
                href={`${path}?${new URLSearchParams({ ...(typeParam ? { type: typeParam } : {}), page: String(n) }).toString()}`}
                className={cn(styles.pageNumber, n === safePage && styles.pageNumberActive)}
              >
                {n}
              </Link>
            ))}
          </div>

          <Link
            href={
              safePage < totalPages
                ? `${path}?${new URLSearchParams({ ...(typeParam ? { type: typeParam } : {}), page: String(safePage + 1) }).toString()}`
                : '#'
            }
            className={cn(styles.pageLink, safePage === totalPages && styles.pageLinkDisabled)}
            aria-disabled={safePage === totalPages}
          >
            Next
          </Link>
        </div>
      )}
    </>
  );
}
