// lib/actions/core/parsers.ts
import type { FieldTypeSpec } from './types';

export function extractFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const existing = result[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        result[key] = [existing, value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function parseFields(
  data: Record<string, unknown>,
  fieldTypes: FieldTypeSpec,
): Record<string, unknown> {
  const parsed: Record<string, unknown> = { ...data };

  const shouldNullifyEmpty = (key: string): boolean =>
    fieldTypes.json.includes(key) ||
    fieldTypes.number.includes(key) ||
    fieldTypes.file.includes(key) ||
    fieldTypes.date.includes(key);

  // 1) Normalize empty strings to null for json/number/file/date fields
  for (const key in parsed) {
    if (parsed[key] === '' && shouldNullifyEmpty(key)) {
      parsed[key] = null;
    }
  }

  // 2) JSON parse for json + file fields (assets are just JSON)
  const jsonLikeKeys = new Set([...fieldTypes.json, ...fieldTypes.file]);
  for (const key of jsonLikeKeys) {
    const val = parsed[key];
    if (typeof val === 'string' && val) {
      try {
        parsed[key] = JSON.parse(val);
      } catch {
        // leave as-is, Zod will produce a nice validation error if shape is wrong
      }
    }
  }

  // 3) Booleans
  for (const key of fieldTypes.boolean) {
    const val = parsed[key];

    if (Array.isArray(val)) {
      parsed[key] = val.some((v) => v === 'true' || v === 'on');
    } else {
      parsed[key] = val === 'true' || val === 'on';
    }
  }
  // 4) Numbers
  for (const key of fieldTypes.number) {
    const val = parsed[key];
    const num = typeof val === 'number' ? val : Number(val);
    if (!Number.isNaN(num)) parsed[key] = num;
  }

  // 5) Dates
  for (const key of fieldTypes.date) {
    const val = parsed[key];
    if (typeof val === 'string' && val) {
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) parsed[key] = d;
    }
  }

  return parsed;
}
