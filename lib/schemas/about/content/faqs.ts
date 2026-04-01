import { z } from 'zod';

export const orgFaqSchema = z.object({
  id: z.string().optional().nullable(),
  question: z.string().min(3, 'Question must be at least 3 characters').max(500),
  answer: z.string().min(2, 'Answer must be at least 2 characters').max(5000),
  published: z.boolean().optional(), // present when checkbox is submitted; absent means unchanged on edit
  rank: z.number().int().positive().optional(),
});
