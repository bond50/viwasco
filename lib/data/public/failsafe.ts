import 'server-only';

const PUBLIC_QUERY_TIMEOUT_MS = 3000;

type FailSoftOptions<T> = {
  label: string;
  fallback: T;
  timeoutMs?: number;
};

export async function failSoftPublicQuery<T>(
  work: Promise<T>,
  { label, fallback, timeoutMs = PUBLIC_QUERY_TIMEOUT_MS }: FailSoftOptions<T>,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      work,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown public data failure';

    console.warn(`[public-data] ${label} failed; using fallback. ${message}`);
    return fallback;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
