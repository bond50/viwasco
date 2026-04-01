/** Very small HTML -> text stripper (server-side use) */
export function stripHtmlToText(html: string): string {
  let s = html;

  // 1) remove script/style
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');

  // 2) remove typical "non-reading" blocks that bloat word counts
  //    - code/pre blocks
  //    - figures that are likely attachments (class contains "attachment" or "file")
  //    - any element marked with data-attachment / data-asset
  s = s.replace(/<pre[\s\S]*?<\/pre>/gi, ' ');
  s = s.replace(/<code[\s\S]*?<\/code>/gi, ' ');
  s = s.replace(/<figure[^>]*class=["'][^"']*(attachment|file)[^"']*["'][\s\S]*?<\/figure>/gi, ' ');
  s = s.replace(/<[^>]*data-(attachment|asset)[^>]*>[\s\S]*?<\/[^>]+>/gi, ' ');

  // 3) strip tags
  s = s.replace(/<\/?[^>]+>/g, ' ');

  // 4) drop URLs, data URIs, and file-like tokens (keep human text)
  //    - http(s)://...  or www....
  s = s.replace(/\bhttps?:\/\/\S+/gi, ' ');
  s = s.replace(/\bwww\.\S+/gi, ' ');
  //    - data: URIs
  s = s.replace(/\bdata:[^ \t\r\n]+/gi, ' ');
  //    - filenames with extensions (foo.pdf, report.docx, image_1234.webp, etc.)
  s = s.replace(
    /\b\S+\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|png|jpe?g|webp|gif|mp4|mov|avi|mkv)\b/gi,
    ' ',
  );

  // 5) collapse whitespace
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Estimate read time in whole minutes.
 * Default WPM = 220 (typical web reading speed).
 * Returns null if there's not enough content to estimate.
 *
 * Attachments often add URL/filename noise; the sanitizer above excludes them.
 */
export function estimateReadTimeFromHtml(html: string, wpm = 220): number | null {
  const text = stripHtmlToText(html);
  if (!text) return null;

  // If there's still very little narrative text, don't show a read time
  const words = text.split(' ').filter(Boolean).length;
  if (words < 80) return null; // raise floor a bit to avoid 1-min for link-only posts

  // Normal estimate
  const minutes = Math.round(words / wpm);

  // Guardrails: cap absurd results for short posts, minimum 1 for longer reads
  return Math.max(1, minutes);
}
