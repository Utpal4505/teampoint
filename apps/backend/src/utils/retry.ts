export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1200,
): Promise<T> {
  let lastError: unknown

  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts) {
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  throw lastError
}
