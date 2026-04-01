export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // decompose accented letters
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // spaces and underscores → hyphen
    .replace(/[^\w-]+/g, '') // remove all non-word characters
    .replace(/--+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens from start/end
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let i = 2;
  while (await exists(candidate)) {
    candidate = `${root}-${i}`;
    i += 1;
  }
  return candidate;
}
