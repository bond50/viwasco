import { z } from 'zod';

export const adminAccessSchema = z.object({
  emails: z.array(z.email().trim().toLowerCase()).optional().nullable(),
  bootstrap: z.coerce.boolean().optional().default(false),
});

export type AdminAccessValues = z.infer<typeof adminAccessSchema>;
