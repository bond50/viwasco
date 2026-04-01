export interface WorkingHoursRow {
  days: string;
  hours: string;

  [key: string]: string;
}

// The whole working-hours value is an array of rows
export type WorkingHours = WorkingHoursRow[];

// Type guards
export const isWorkingHoursRow = (x: unknown): x is WorkingHoursRow =>
  !!x &&
  typeof x === 'object' &&
  typeof (x as Record<string, unknown>).days === 'string' &&
  typeof (x as Record<string, unknown>).hours === 'string';

export const toWorkingHours = (val: unknown): WorkingHours | null => {
  if (!Array.isArray(val)) return null;
  const rows = val.filter(isWorkingHoursRow);
  return rows.length ? (rows as WorkingHours) : [];
};
