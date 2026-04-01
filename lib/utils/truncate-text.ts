// Reusable text truncation helper.
// - Trims input
// - Cuts at a word boundary when possible
// - Strips trailing punctuation before suffix
export function truncate(input: unknown, max = 140, suffix = '…'): string {
  const s = (typeof input === 'string' ? input : String(input ?? '')).trim();
  if (!s) return '';
  if (s.length <= max) return s;

  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > 40 ? cut.slice(0, lastSpace) : cut; // avoid cutting too close to the start
  return base.replace(/[\s,.:;!\-]+$/u, '') + suffix;
}
