// lib/actions/core/post-success.ts
import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

// Infer the exact type required by your installed Next.js version
type RevalidateTagProfile = Parameters<typeof revalidateTag>[1];

export type PostSuccessOpts = {
  revalidate?: string; // single path (optional convenience)
  revalidatePaths?: string[]; // ✅ multiple paths
  revalidateTags?: string[]; // tags
  redirectTo?: string; // optional redirect (throws)
  profile?: RevalidateTagProfile; // e.g. 'max' or { revalidate: number }
};

export function postSuccess({
  revalidate,
  revalidatePaths,
  revalidateTags,
  redirectTo,
  profile = 'max',
}: PostSuccessOpts): void {
  if (revalidateTags?.length) {
    for (const tag of revalidateTags) revalidateTag(tag, profile);
  }

  if (revalidatePaths?.length) {
    for (const p of revalidatePaths) revalidatePath(p);
  } else if (revalidate) {
    revalidatePath(revalidate);
  }

  if (redirectTo) redirect(redirectTo); // keep outside try/catch in callers
}
