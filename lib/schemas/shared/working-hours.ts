import { z } from 'zod';

export const workingHoursSchema = z
  .array(
    z.object({
      days: z.string(),
      hours: z.string(),
    }),
  )
  .optional()
  .nullable();
