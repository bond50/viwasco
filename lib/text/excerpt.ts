// lib/text/excerpt.ts
export const DEFAULT_EXCERPT_LEN = 220;

/** Internal: robust HTML→plain excerpt core (never exported) */
function excerptCore(input: string | null | undefined, maxLen = DEFAULT_EXCERPT_LEN): string {
  if (!input) return '';

  let s = String(input);

  // Remove script/style
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

  // Normalize line breaks for common block endings & <br>
  s = s
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|section|article|li|ul|ol|h[1-6])\s*>/gi, '\n');

  // Strip all remaining tags
  s = s.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  s = s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/');

  // Collapse whitespace
  let text = s.replace(/\s+/g, ' ').trim();

  // Fallback: super-naive strip on the original input if still empty
  if (!text) {
    text = String(input)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!text) return '';
  if (text.length <= maxLen) return text;

  // Prefer cutting at a word boundary
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const boundaryOK = lastSpace > Math.floor(maxLen * 0.55);
  const head = (boundaryOK ? slice.slice(0, lastSpace) : slice)
    .replace(/[\s,.:;!\-]+$/u, '')
    .trim();

  return head ? head + '…' : text.slice(0, maxLen).trim();
}

/**
 * Public API (backward compatible name):
 * - Uses `excerptCore`
 * - If result is empty or just "…", falls back to a simple strip+truncate
 */
export function htmlToExcerpt(
  input: string | null | undefined,
  maxLen = DEFAULT_EXCERPT_LEN,
): string {
  const primary = excerptCore(input, maxLen);
  if (primary && primary !== '…') return primary;

  const raw = String(input ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!raw) return '';
  return raw.length > maxLen ? raw.slice(0, maxLen - 1).trimEnd() + '…' : raw;
}
