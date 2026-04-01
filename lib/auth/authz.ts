import 'server-only';
import { db } from '@/lib/db';

const ENV_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const ENV_BOOTSTRAP = (process.env.ADMIN_BOOTSTRAP ?? 'false').toLowerCase() === 'true';

type AdminControls = { emails: string[]; bootstrap: boolean };

let cache: { at: number; value: AdminControls } | null = null;

// Small 60s cache to avoid frequent DB hits
async function loadAdminControls(): Promise<AdminControls> {
  const now = Date.now();
  if (cache && now - cache.at < 60_000) return cache.value;

  const org = await db.organization.findFirst({
    select: { adminAllowlist: true, adminBootstrap: true },
  });

  const dbEmails = Array.isArray(org?.adminAllowlist)
    ? (org!.adminAllowlist as unknown as string[])
    : [];

  const emails = (dbEmails.length ? dbEmails : ENV_EMAILS).map((e) => e.toLowerCase());
  const bootstrap = typeof org?.adminBootstrap === 'boolean' ? org!.adminBootstrap : ENV_BOOTSTRAP;

  cache = { at: now, value: { emails, bootstrap } };
  return cache.value;
}

// Async, DB-first (preferred in login/Auth)
export async function isAllowlisted(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const { emails } = await loadAdminControls();
  return emails.includes(email.toLowerCase());
}

export async function canBootstrap(): Promise<boolean> {
  const { bootstrap } = await loadAdminControls();
  return bootstrap;
}

// Synchronous fallbacks (if you still need sync contexts)
export function isAllowlistedEnvOnly(email?: string | null): boolean {
  return !!email && ENV_EMAILS.includes(email.toLowerCase());
}

export function canBootstrapEnvOnly(): boolean {
  return ENV_BOOTSTRAP;
}
