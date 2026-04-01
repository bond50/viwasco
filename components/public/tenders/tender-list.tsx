import Link from 'next/link';
import { FiFileText } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import styles from '@/components/public/resources/resources.module.css';
import { getPaginatedTenders, type TenderStatus, tenderStatuses } from '@/lib/data/public/tenders/getters';

type Props = {
  title: string;
  description: string;
  path: string;
  searchParams?: Promise<{ status?: string; page?: string }>;
};

export async function TenderListContent({ title, description, path, searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const statusParam = params.status as TenderStatus | undefined;
  const pageParam = params.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 6;
  const { items, totalPages, page: safePage } = await getPaginatedTenders(
    statusParam,
    Number.isFinite(page) ? page : 1,
    pageSize,
  );

  return (
    <>
      <div className={styles.resourcesHeader}>
        <div>
          <h2 className="mb-2">{title}</h2>
          <p className="text-muted mb-0">{description}</p>
        </div>
        <div className={styles.filterChips}>
          <Link href={path} className={cn(styles.chip, !statusParam && styles.chipActive)}>
            All
          </Link>
          {tenderStatuses.map((status) => (
            <Link
              key={status.id}
              href={`${path}?status=${status.id}`}
              className={cn(styles.chip, statusParam === status.id && styles.chipActive)}
            >
              {status.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.listIcon}>
                <FiFileText />
              </div>
              <div className={styles.listMeta}>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className={styles.chip}>{item.status.toUpperCase()}</span>
                  <span className={styles.chip}>Updated: {item.updated.slice(0, 10)}</span>
                </div>
              </div>
              <Link href={item.downloadUrl} className={styles.listAction} target="_blank" rel="noreferrer">
                Download
              </Link>
            </div>
          ))
        ) : (
          <div className="alert alert-info mb-0">
            No tenders have been published yet.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Link
            href={
              safePage > 1
                ? `${path}?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(safePage - 1) }).toString()}`
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
                href={`${path}?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(n) }).toString()}`}
                className={cn(styles.pageNumber, n === safePage && styles.pageNumberActive)}
              >
                {n}
              </Link>
            ))}
          </div>
          <Link
            href={
              safePage < totalPages
                ? `${path}?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(safePage + 1) }).toString()}`
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
