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
    console.error(`[public-data] ${label} failed`, error);
    return fallback;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
