/**
 * Helpers para simulação de latência em dev (ex.: login mockado).
 * Nunca use em produção real — apenas para mocks e demos.
 */
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Abortado', 'AbortError'));
      return;
    }
    const id = setTimeout(() => resolve(), ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Abortado', 'AbortError'));
    });
  });
}
