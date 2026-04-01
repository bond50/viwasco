import { z } from 'zod';

/**
 * String required with friendly messages.
 * - If value is undefined/null -> "X is required"
 * - If provided but too short (min > 1) -> "X must be at least N characters"
 */
export const requiredText = (label: string, min = 1) =>
  z
    .preprocess((v) => (v == null ? '' : v), z.string().min(1, { message: `${label} is required` }))
    .refine((v) => (v as string).length >= min, {
      message: min > 1 ? `${label} must be at least ${min} characters` : `${label} is required`,
    });

/**
 * Optional URL with friendly messages when present.
 * Uses your isValidUrl util.
 */
export const optionalUrlString = (isValidUrl: (u: string) => boolean) =>
  z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || isValidUrl(v), { message: 'Enter a valid URL' });

/**
 * Make an object field required with a friendly messages.
 * Avoids deprecated enums; uses raw "custom" code.
 */
export const requiredObject = <T extends z.ZodTypeAny>(schema: T, label: string) =>
  z
    .union([schema, z.null(), z.undefined()])
    .superRefine((val, ctx) => {
      if (val == null) {
        ctx.addIssue({ code: 'custom', message: `${label} is required` });
      }
    })
    .transform((val) => val as z.infer<T>);
