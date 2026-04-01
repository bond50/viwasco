export function coerceHtml(input: unknown): string | null {
  if (typeof input === 'string') return input;
  if (input && typeof input === 'object' && 'html' in (input as Record<string, unknown>)) {
    const html = (input as Record<string, unknown>)['html'];
    if (typeof html === 'string') return html;
  }
  return null;
}
