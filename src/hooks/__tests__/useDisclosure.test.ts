import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDisclosure } from '../useDisclosure';

describe('useDisclosure', () => {
  it('inicia fechado por padrão', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('abre e fecha', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });
});
