'use client';

import { useMemo, useState } from 'react';
import styles from './careers.module.css';
import resourcesStyles from '@/components/public/resources/resources.module.css';
import { jobFilters, JobItem } from '@/lib/data/public/careers/static';

type Props = {
  jobs: JobItem[];
};

export function CareerList({ jobs }: Props) {
  const [department] = useState('All');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const deptOk = department === 'All' || job.department === department;
      const typeOk = type === 'All' || job.type === type;
      return deptOk && typeOk;
    });
  }, [jobs, department, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const setTypeFilter = (value: string) => {
    setType(value);
    setPage(1);
  };

  return (
    <>
      <div className={resourcesStyles.resourcesHeader}>
        <div>
          <h2 className="mb-2">Open Positions</h2>
          <p className="text-muted mb-0">
            Filter by contract type to find the right opportunity.
          </p>
        </div>
        <div className={resourcesStyles.filterChips}>
          {jobFilters.types.map((item) => (
            <button
              key={item}
              className={
                item === type
                ? `${resourcesStyles.chip} ${resourcesStyles.chipActive}`
                : resourcesStyles.chip
              }
              onClick={() => setTypeFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.jobList}>
        {paged.map((job) => (
          <div key={job.id} className={styles.jobCard}>
            <div className="h5 mb-0">{job.title}</div>
            <div className={styles.jobMeta}>
              <span>{job.department}</span>
              <span>{job.type}</span>
              <span>{job.location}</span>
              <span>Closing: {job.closingDate}</span>
            </div>
            <div>
              <a className="btn-outline-accent" href={job.pdfUrl} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={resourcesStyles.pagination}>
          <button
            type="button"
            className={`${resourcesStyles.pageLink} ${safePage === 1 ? resourcesStyles.pageLinkDisabled : ''}`}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Previous
          </button>

          <div className={resourcesStyles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`${resourcesStyles.pageNumber} ${n === safePage ? resourcesStyles.pageNumberActive : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`${resourcesStyles.pageLink} ${safePage === totalPages ? resourcesStyles.pageLinkDisabled : ''}`}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
