// lib/schemas/utils/form.ts
import { z } from 'zod';

/**
 * Normalizes select/radio values coming from FormData:
 * - Accepts string or string[]
 * - Trims whitespace
 * - Uppercases the value (so 'government' -> 'GOVERNMENT')
 * - Treats empty / null as undefined
 *
 * You then `.pipe(z.enum([...]))` or `.transform(...)` on top.
 */
export function enumSelectBase() {
  return z.preprocess(
    (v) => {
      // Empty or missing → undefined
      if (v == null || v === '') {
        return undefined;
      }

      // If FormData gave us an array (common with extractFormData helpers)
      if (Array.isArray(v)) {
        const [first] = v;
        if (typeof first === 'string') {
          const trimmed = first.trim();
          return trimmed ? trimmed.toUpperCase() : undefined;
        }
        return undefined;
      }

      // Normal case: a single string
      if (typeof v === 'string') {
        const trimmed = v.trim();
        return trimmed ? trimmed.toUpperCase() : undefined;
      }

      // Anything else → treat as missing
      return undefined;
    },
    // After preprocess, we always parse as optional string
    z.string().optional(),
  );
}

/**
 * Convenience wrapper: directly get a Zod enum field that:
 * - Normalizes the input like `enumSelectBase`
 * - Validates it against the given enum values
 */
export function enumSelect<TValues extends readonly [string, ...string[]]>(values: TValues) {
  return enumSelectBase().pipe(z.enum(values));
}
