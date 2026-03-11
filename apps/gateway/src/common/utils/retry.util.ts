const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function retryAsync<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (i + 1)));
      }
    }
  }
  throw lastError ?? new Error('Retry failed');
}
