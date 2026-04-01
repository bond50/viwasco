import { z } from 'zod';

export const orgMessageSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(2).max(200),

  // Let excerpt be optional/empty; finalExcerpt() already handles fallback
  excerpt: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((v) => (v == null ? '' : v))
    .refine((v) => v.length <= 600, {
      message: 'Excerpt must be at most 600 characters',
    }),

  body: z.string().min(10),

  // 🔧 FIX: accept either string OR [string] and normalise to a single string
  authorTeamId: z.preprocess(
    (value) => {
      if (Array.isArray(value)) {
        // react-select or custom Select often posts ["id"]
        return value[0] ?? '';
      }
      return value;
    },
    z.string().min(1, 'Leader is required'),
  ),

  published: z.boolean().optional(),
});
