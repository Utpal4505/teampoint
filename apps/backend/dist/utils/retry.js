export async function withRetry(fn, attempts = 3, delay = 1200) {
    let lastError;
    for (let i = 1; i <= attempts; i++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            if (i < attempts) {
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry.js.map