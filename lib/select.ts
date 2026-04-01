import { type GenericOption } from '@/components/form-elements/select';

export function resolveDefaultOption<T extends GenericOption<string>>(
  options: T[],
  selectedId?: string,
): T | undefined {
  if (!options.length) return undefined;
  if (selectedId) {
    const match = options.find((opt) => opt.value === selectedId);
    if (match) return match;
  }
  return options[0];
}
