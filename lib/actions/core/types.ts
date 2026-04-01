// lib/actions/core/types.ts
import type { z } from 'zod';
import type { ExtendedUser } from '@/next-auth';

export type FieldTypeSpec = {
  json: string[];
  boolean: string[];
  number: string[];
  file: string[];
  date: string[];
};

export type ActionResult<Out> = {
  errors?: Record<string, string[]>;
  values?: Partial<Out>;
  success?: boolean;
};

export type ActionOptions<Out, In = unknown> = {
  schema: z.ZodType<Out, In>;
  formData: FormData;
  execute: (validatedData: Out, user: ExtendedUser) => Promise<void>;
  redirectTo?: string;
  revalidate?: string; // single path (kept for convenience)
  revalidatePaths?: string[];
  revalidateTags?: string[];
  jsonFields?: string[];
  booleanFields?: string[];
  numberFields?: string[];
  fileFields?: string[];
  dateFields?: string[];
};
