/**
 * Invariantes e asserções. Lançam `AssertionError` (estende `Error`)
 * para sinalizar violações de contrato em runtime — útil em fronteiras
 * de módulos onde tipos não garantem o suficiente.
 */
export class AssertionError extends Error {
  override readonly name = 'AssertionError';
  constructor(message: string) {
    super(message);
  }
}

export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Valor esperado definido',
): asserts value is T {
  if (value === null || value === undefined) {
    throw new AssertionError(message);
  }
}

export function assert(condition: unknown, message = 'Asserção falhou'): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}

export function exhaustive(
  value: never,
  message = `Caso exaustivo não tratado: ${String(value)}`,
): never {
  throw new AssertionError(message);
}
