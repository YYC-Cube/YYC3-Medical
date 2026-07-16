import { useAsync } from '@/hooks/useAsync';
import { act, renderHook } from '@testing-library/react';

describe('hooks/useAsync', () => {
  it('initializes with idle state', () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useAsync(mockFn));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('executes async function and sets success state', async () => {
    const mockFn = jest.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('result');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('handles error state', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('test error'));
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // expected
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe('test error');
  });

  it('passes arguments to async function', async () => {
    const mockFn = jest.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute('arg1', 42);
    });

    expect(mockFn).toHaveBeenCalledWith('arg1', 42);
  });

  it('resets state to initial', async () => {
    const mockFn = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('executes immediately when immediate=true', async () => {
    const mockFn = jest.fn().mockResolvedValue('immediate');
    const { result } = renderHook(() => useAsync(mockFn, true));

    // should be in loading state immediately
    expect(result.current.isLoading).toBe(true);

    // wait for async to complete
    await act(async () => {
      await new Promise(r => setTimeout(r, 10));
    });

    expect(result.current.data).toBe('immediate');
    expect(result.current.isSuccess).toBe(true);
  });

  it('handles non-Error throwable', async () => {
    const mockFn = jest.fn().mockRejectedValue('string error');
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // expected
      }
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe('string error');
  });
});
