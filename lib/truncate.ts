// lib/truncate.ts
function stripTags(html: string): string {
  // Remove <script> and <style> blocks completely
  const withoutScriptsAndStyles = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  // Remove all remaining tags
  return withoutScriptsAndStyles.replace(/<[^>]+>/g, '');
}

function normalizeText(raw: string): string {
  return (
    raw
      // basic entity cleanup
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      // collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Heuristic: decide if this paragraph looks like real content
 * - long enough
 * - has lowercase letters (not just acronyms / table labels)
 */
function looksLikeContent(text: string): boolean {
  if (!text) return false;

  const MIN_PARAGRAPH_LENGTH = 40; // tweak if you want
  if (text.length < MIN_PARAGRAPH_LENGTH) return false;

  // Require at least one lowercase letter → avoids FDFDFD / NCCHHC / MESII
  if (!/[a-z]/.test(text)) return false;

  return true;
}

/**
 * 1. Scan <p>…</p> blocks in order
 * 2. Skip empty, tiny, or all-caps “noise” (tables, headings, etc.)
 * 3. Use the first paragraph that looks like real prose
 * 4. If none, fallback to full HTML stripped
 * 5. Truncate to maxLength with …
 */
export function extractFirstParagraphAndTruncate(html: string, maxLength: number): string {
  if (!html) return '';

  // Grab ALL paragraphs, not just the first, so we can skip noisy ones
  const paragraphMatches = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) ?? [];

  let chosenText: string | null = null;

  for (const p of paragraphMatches) {
    // Remove the outer <p> tags
    const inner = p.replace(/<\/?p[^>]*>/gi, '');
    const stripped = stripTags(inner);
    const normalized = normalizeText(stripped);

    // Skip empty / noise paragraphs (tiny, all caps, etc.)
    if (!looksLikeContent(normalized)) continue;

    chosenText = normalized;
    break;
  }

  // Fallback: if there were no useful <p> blocks, use whole HTML stripped
  if (!chosenText) {
    const stripped = stripTags(html);
    const normalized = normalizeText(stripped);
    if (!normalized) return '';
    chosenText = normalized;
  }

  if (chosenText.length <= maxLength) {
    return chosenText;
  }

  return chosenText.slice(0, maxLength).trimEnd() + '…';
}
