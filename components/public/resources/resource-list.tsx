import Link from 'next/link';
import { FiExternalLink, FiFile, FiFileText } from 'react-icons/fi';
import { FaFileExcel } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import styles from './resources.module.css';
import { getPaginatedResources, type ResourceKind } from '@/lib/data/public/resources/getters';

function iconForType(type: string) {
  switch (type) {
    case 'pdf':
      return <FiFileText />;
    case 'doc':
      return <FiFile />;
    case 'xls':
      return <FaFileExcel />;
    default:
      return <FiExternalLink />;
  }
}

type Props = {
  kind: ResourceKind;
  title: string;
  description?: string | null;
  path: string;
  searchParams?: Promise<{ category?: string; page?: string }>;
};

export async function ResourceListContent({
  kind,
  title,
  description,
  path,
  searchParams,
}: Props) {
  const params = (await searchParams) ?? {};
  const category = params.category || undefined;
  const pageParam = params.page;
  const page = pageParam ? Number(pageParam) : 1;
  const pageSize = 6;

  const { items, categories, totalPages, page: safePage } = await getPaginatedResources(
    kind,
    category,
    Number.isFinite(page) ? page : 1,
    pageSize,
  );

  return (
    <>
      <div className={styles.resourcesHeader}>
        <div>
          <h2 className="mb-2">{title}</h2>
          {description ? <p className="text-muted mb-0">{description}</p> : null}
        </div>
        <div className={styles.filterChips}>
          <Link href={path} className={cn(styles.chip, !category && styles.chipActive)}>
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${path}?category=${cat.id}`}
              className={cn(styles.chip, category === cat.id && styles.chipActive)}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.listIcon}>{iconForType(item.type)}</div>
              <div className={styles.listMeta}>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
              </div>
              <Link href={item.downloadUrl} className={styles.listAction} target="_blank" rel="noreferrer">
                Download
              </Link>
            </div>
          ))
        ) : (
          <div className="alert alert-info mb-0">
            No resources have been published for this section yet.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Link
            href={
              safePage > 1
                ? `${path}?${new URLSearchParams({
                    ...(category ? { category } : {}),
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
                href={`${path}?${new URLSearchParams({
                  ...(category ? { category } : {}),
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
                ? `${path}?${new URLSearchParams({
                    ...(category ? { category } : {}),
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
    </>
  );
}
