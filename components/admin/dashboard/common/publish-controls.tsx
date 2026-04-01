'use client';

type DateLike = Date | string | null | undefined;

type PublishControlsProps = {
  publishedAt?: {
    name: string;
    label?: string;
    value?: DateLike;
    columnClassName?: string;
  };
  active: {
    name: string;
    label?: string;
    checked: boolean;
    columnClassName?: string;
  };
};

function toDateInput(value: DateLike): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function PublishControls({ publishedAt, active }: PublishControlsProps) {
  const hasPublishedAt = Boolean(publishedAt);

  return (
    <div className="row g-3 mb-3">
      {publishedAt ? (
        <div className={publishedAt.columnClassName ?? 'col-md-3'}>
          <label className="form-label" htmlFor={publishedAt.name}>
            {publishedAt.label ?? 'Published Date'}
          </label>
          <input
            id={publishedAt.name}
            name={publishedAt.name}
            type="date"
            className="form-control"
            defaultValue={toDateInput(publishedAt.value)}
          />
        </div>
      ) : null}

      <div className={active.columnClassName ?? (hasPublishedAt ? 'col-md-3' : 'col-md-12')}>
        <div className="form-check mt-3">
          <input
            id={active.name}
            name={active.name}
            type="checkbox"
            className="form-check-input"
            defaultChecked={active.checked}
          />
          <label className="form-check-label" htmlFor={active.name}>
            {active.label ?? 'Active'}
          </label>
        </div>
      </div>
    </div>
  );
}
