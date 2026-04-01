// lib/text/readtime.ts
/**
 * Extract plain text from HTML (drop tags/scripts/styles) and normalize whitespace.
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  // strip script/style
  const noScript = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const noStyle = noScript.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  // strip tags
  const noTags = noStyle.replace(/<\/?[^>]+>/g, ' ');
  // decode the common &nbsp; to space
  const noNbsp = noTags.replace(/&nbsp;/gi, ' ');
  // collapse whitespace
  return noNbsp.replace(/\s+/g, ' ').trim();
}

/**
 * Count "words" using Unicode letters/numbers (so spaces/punctuation aren't counted).
 * This excludes spaces by design (as you asked).
 */
export function countWords(text: string): number {
  // match sequences of letters/numbers/underscore
  const m = text.match(/[\p{L}\p{N}_]+/gu);
  return m ? m.length : 0;
}

/**
 * Compute read time minutes using words-per-minute (default ~220).
 */
export function computeReadTimeMinutes(html: string, wpm = 220): number {
  const plain = htmlToPlainText(html);
  const words = countWords(plain);
  // at least 1 minute for non-empty content
  return words ? Math.max(1, Math.ceil(words / wpm)) : 0;
}
