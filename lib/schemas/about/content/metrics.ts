import { z } from 'zod';

export const orgMetricSchema = z.object({
  id: z.string().optional().nullable(),
  label: z.string().min(2).max(160),
  value: z.number().int(), // whole numbers for counters; change to z.number() if decimals needed
  unit: z.string().max(40).optional().nullable(),
  icon: z.string().max(160).optional().nullable(),
  published: z.boolean().optional(),
  rank: z.number().int().positive().optional(),
});
