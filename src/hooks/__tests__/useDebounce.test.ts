import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 100));
    expect(result.current).toBe('inicial');
  });

  it('atualiza o valor após o delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'A' },
    });
    rerender({ value: 'B' });
    expect(result.current).toBe('A');
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('B');
    vi.useRealTimers();
  });
});
