import { WorkingHours, WorkingHoursRow } from '@/lib/types/working-hours';

const isRow = (v: unknown): v is WorkingHoursRow =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as Record<string, unknown>).days === 'string' &&
  typeof (v as Record<string, unknown>).hours === 'string';

/** Parse unknown JSON into WorkingHours or null */
export const parseWorkingHours = (value: unknown): WorkingHours | null => {
  if (!Array.isArray(value)) return null;
  return value.filter(isRow) as WorkingHours;
};
