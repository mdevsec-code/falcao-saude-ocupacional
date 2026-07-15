/**
 * Geração de identificadores únicos. Usa `crypto.randomUUID` quando
 * disponível (browsers modernos, Node 19+, jsdom recente) e cai para
 * `Math.random` em ambientes legados.
 */
export function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // RFC4122 v4 aproximado — não é criptograficamente seguro.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** ID curto (10 chars), útil para chaves React e referências visíveis. */
export function shortId(): string {
  return Math.random().toString(36).slice(2).padEnd(10, '0').slice(0, 10);
}
