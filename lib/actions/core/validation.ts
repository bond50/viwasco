// lib/actions/core/validation.ts
import type { z } from 'zod';
import type { ActionResult } from './types';

export function normalizeFieldErrors(
  errors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, v as string[]]),
  );
}

export async function validateWithZod<Out, In = unknown>(
  schema: z.ZodType<Out, In>,
  data: Record<string, unknown>,
): Promise<{ ok: true; data: Out } | { ok: false; result: ActionResult<Out> }> {
  const parsed = await schema.safeParseAsync(data);

  if (!parsed.success) {
    const flattened = parsed.error.flatten((issue) => issue.message);
    return {
      ok: false,
      result: {
        errors: normalizeFieldErrors(flattened.fieldErrors),
        values: data as Partial<Out>,
        success: false,
      },
    };
  }
  return { ok: true, data: parsed.data };
}
