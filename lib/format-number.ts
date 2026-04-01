/** Compact formatter for numeric-ish metric values (K / M / B). */
export function formatCompactNumber(raw: unknown): string {
  if (raw == null) return '';

  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
        ? Number(raw.replace(/,/g, '').trim())
        : NaN;

  if (!Number.isFinite(n)) return String(raw);

  const abs = Math.abs(n);
  const trim0 = (s: string) => s.replace(/\.0$/, '');

  if (abs >= 1e9) return trim0((n / 1e9).toFixed(abs >= 1e10 ? 0 : 1)) + 'B';
  if (abs >= 1e6) return trim0((n / 1e6).toFixed(abs >= 1e7 ? 0 : 1)) + 'M';
  if (abs >= 1e3) return trim0((n / 1e3).toFixed(abs >= 1e4 ? 0 : 1)) + 'K';

  return n.toLocaleString('en-KE', {
    maximumFractionDigits: n % 1 ? 1 : 0,
  });
}
