// lib/rate-limit.ts
import { headers } from 'next/headers';

/** Minimal interface we need from a rate limiter */
type LimitResult = { success: boolean };
type RateLimiter = { limit: (key: string) => Promise<LimitResult> };

/** Simple sliding window in-memory bucket (dev fallback only) */
class MemoryBucket {
  private store = new Map<string, number[]>();

  constructor(
    private max: number,
    private windowMs: number,
  ) {}

  hit(key: string): LimitResult {
    const now = Date.now();
    const arr = this.store.get(key) ?? [];
    const fresh = arr.filter((t) => now - t < this.windowMs);
    if (fresh.length >= this.max) return { success: false };
    fresh.push(now);
    this.store.set(key, fresh);
    return { success: true };
  }
}

/** Limits */
const LOGIN_MAX = 100; // 10 login attempts / 60s per IP and per account
const LOGIN_WINDOW_MS = 60_0000;

const MFA_MAX = 100; // 5 2FA emails / 10m per account
const MFA_WINDOW_MS = 100 * 60_0000;

const AUTHAPI_MAX = 300; // 30 hits / 60s per IP for /api/auth/*
const AUTHAPI_WINDOW_MS = 60_0000;

/** Fallback buckets */
const memLogin = new MemoryBucket(LOGIN_MAX, LOGIN_WINDOW_MS);
const mem2FA = new MemoryBucket(MFA_MAX, MFA_WINDOW_MS);
const memAuthAPI = new MemoryBucket(AUTHAPI_MAX, AUTHAPI_WINDOW_MS);

/** Upstash limiters (initialized lazily) */
let useFallback = true;
let upstashLogin: RateLimiter | null = null;
let upstash2FA: RateLimiter | null = null;
let upstashAuthAPI: RateLimiter | null = null;
let initialized = false;

/** Lazy initialize Upstash clients if env is present */
async function ensureInit(): Promise<void> {
  if (initialized) return;
  initialized = true;

  try {
    const hasEnv = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!hasEnv) {
      useFallback = true;
      return;
    }

    // Types inferred while keeping runtime dynamic
    const [{ Ratelimit }, { Redis }] = await Promise.all([
      import('@upstash/ratelimit'),
      import('@upstash/redis'),
    ]);

    const redis = Redis.fromEnv();

    upstashLogin = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(LOGIN_MAX, '60 s'),
      prefix: 'rl:login',
    });

    upstash2FA = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MFA_MAX, '10 m'),
      prefix: 'rl:2fa',
    });

    upstashAuthAPI = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(AUTHAPI_MAX, '60 s'),
      prefix: 'rl:authapi',
    });

    useFallback = false;
  } catch {
    // missing deps or not available on this runtime → fallback
    useFallback = true;
  }
}

/** Best-effort client IP (server actions / RSC / Route Handlers context) */
async function getIPFromHeaders(): Promise<string> {
  // In some Next versions, headers() is typed as possibly Promise-like; awaiting is safe either way
  const h = await headers();
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return h.get('x-real-ip') ?? 'ip:unknown';
}

/** Public: assert login is not rate-limited (per IP + per account) */
export async function assertNotRateLimitedLogin(email: string): Promise<void> {
  await ensureInit();
  const ip = await getIPFromHeaders();
  const keyIP = `ip:${ip}`;
  const keyAcct = `acct:${email.toLowerCase()}`;

  if (useFallback) {
    const ok1 = memLogin.hit(keyIP).success;
    const ok2 = memLogin.hit(keyAcct).success;
    if (!ok1 || !ok2) throw new Error('rate_limited');
    return;
  }

  const [r1, r2] = await Promise.all([upstashLogin!.limit(keyIP), upstashLogin!.limit(keyAcct)]);
  if (!r1.success || !r2.success) throw new Error('rate_limited');
}

/** Public: assert 2FA send is not rate-limited (per account) */
export async function assertNotRateLimited2FA(email: string): Promise<void> {
  await ensureInit();
  const keyAcct = `acct:${email.toLowerCase()}`;

  if (useFallback) {
    const ok = mem2FA.hit(keyAcct).success;
    if (!ok) throw new Error('rate_limited');
    return;
  }

  const r = await upstash2FA!.limit(keyAcct);
  if (!r.success) throw new Error('rate_limited');
}

/**
 * Public: assert NextAuth API is not rate-limited (per IP).
 * If you already know the IP (e.g., middleware), pass it in; otherwise we read from headers().
 */
export async function assertNotRateLimitedAuthAPI(ipOverride?: string): Promise<void> {
  await ensureInit();
  const ip = ipOverride ?? (await getIPFromHeaders());
  const keyIP = `ip:${ip}`;

  if (useFallback) {
    const ok = memAuthAPI.hit(keyIP).success;
    if (!ok) throw new Error('rate_limited');
    return;
  }

  const r = await upstashAuthAPI!.limit(keyIP);
  if (!r.success) throw new Error('rate_limited');
}
