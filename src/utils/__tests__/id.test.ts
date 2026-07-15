import { describe, expect, it } from 'vitest';
import { shortId, uuid } from '../id';

describe('id utils', () => {
  it('uuid retorna string com 36 caracteres', () => {
    const id = uuid();
    expect(id).toHaveLength(36);
  });

  it('uuid retorna valores únicos', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uuid()));
    expect(ids.size).toBe(100);
  });

  it('shortId retorna 10 caracteres', () => {
    expect(shortId()).toHaveLength(10);
  });
});
