/* eslint-disable @typescript-eslint/no-explicit-any */

export function getFieldError(errors?: Record<string, any>, field?: string): string | undefined {
  if (!errors || !field) return undefined;

  const parts = field.split('.');
  let current = errors;

  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[part];
  }

  if (Array.isArray(current)) return current[0];
  return undefined;
}

export function getCoreValuesErrors(errors?: Record<string, any>) {
  return {
    leadText: getFieldError(errors, 'coreValuesLeadText')
      ? [getFieldError(errors, 'coreValuesLeadText')!]
      : undefined,
    values: errors?.coreValues?.values
      ? [errors.coreValues.values as Record<string, string[]>]
      : undefined,
  };
}
