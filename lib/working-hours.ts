import { z } from 'zod';

export const workingHourItemSchema = z.object({
  days: z.string().min(1),
  hours: z.string().min(1),
});

export const workingHoursSchema = z.array(workingHourItemSchema);

/** Parses Organization.workingHours JSON into a typed list (or empty). */
export function parseWorkingHours(input: unknown) {
  const parsed = workingHoursSchema.safeParse(input);
  return parsed.success ? parsed.data : [];
}

/** Compact label for topbar (first entry only, e.g., "Mon–Fri 08:00–17:00"). */
export function workingHoursTopbarLabel(input: unknown): string | null {
  const list = parseWorkingHours(input);
  if (!list.length) return null;
  const first = list[0];
  return `${first.days} ${first.hours}`.trim();
}
