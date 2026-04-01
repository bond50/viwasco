// lib/process-date-field.ts

export const processDateField = (input: unknown): Date | null => {
  if (!input) return null;

  if (input instanceof Date) return input;

  if (typeof input === 'string' || typeof input === 'number') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};
