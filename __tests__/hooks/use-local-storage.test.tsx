import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('hooks/useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('returns stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('stored');
  });

  it('updates value and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('supports function updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('removes value and resets to initial', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('stored');
    });
    expect(result.current[0]).toBe('stored');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('initial');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('handles complex objects', () => {
    const obj = { name: 'test', count: 42 };
    const { result } = renderHook(() => useLocalStorage('obj-key', { name: '', count: 0 }));

    act(() => {
      result.current[1](obj);
    });

    expect(result.current[0]).toEqual(obj);
    expect(JSON.parse(localStorage.getItem('obj-key')!)).toEqual(obj);
  });

  it('handles null values', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('nullable-key', null));

    act(() => {
      result.current[1]('not-null');
    });
    expect(result.current[0]).toBe('not-null');

    act(() => {
      result.current[1](null);
    });
    expect(result.current[0]).toBeNull();
  });
});