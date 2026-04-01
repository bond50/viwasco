// utils/date-utils.ts
import { processDateField } from '@/lib/utils/process-date-field';

/** Safely turn possibly-null date-like core-values into a numeric epoch for comparisons */
export function toEpoch(input: unknown): number {
  const d = processDateField(input);
  return d ? d.getTime() : 0;
}

type DateKey = 'date' | 'createdAt' | 'updatedAt';

function getEpoch(obj: unknown, key: DateKey): number {
  if (obj && typeof obj === 'object' && key in obj) {
    const v = (obj as Record<string, unknown>)[key];
    return toEpoch(v);
  }
  return 0;
}

/** Compare two objects that may expose createdAt/updatedAt or date fields — no `any`. */
export function compareMostRecent(a: unknown, b: unknown, opts?: { preferField?: 'date' }): number {
  const prefer = opts?.preferField;

  const ta = Math.max(
    prefer ? getEpoch(a, 'date') : 0,
    getEpoch(a, 'updatedAt'),
    getEpoch(a, 'createdAt'),
  );

  const tb = Math.max(
    prefer ? getEpoch(b, 'date') : 0,
    getEpoch(b, 'updatedAt'),
    getEpoch(b, 'createdAt'),
  );

  return tb - ta;
}
