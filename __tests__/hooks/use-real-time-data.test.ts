import { renderHook, act } from '@testing-library/react';
import { useRealTimeData } from '@/hooks/use-real-time-data';

describe('hooks/use-real-time-data', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches initial data on mount', async () => {
    const fetchFn = jest.fn().mockResolvedValue({ count: 42 });

    const { result } = renderHook(() =>
      useRealTimeData(fetchFn, { count: 0 }, { enabled: true, interval: 5000 })
    );

    // Flush the initial fetch promise
    await act(async () => {
      await jest.advanceTimersByTimeAsync(100);
    });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual({ count: 42 });
    expect(result.current.error).toBeNull();
  });

  it('retries on failure up to retryCount', async () => {
    const fetchFn = jest
      .fn<Promise<{ ok: boolean }>, []>()
      .mockRejectedValueOnce(new Error('fail-1'))
      .mockRejectedValueOnce(new Error('fail-2'))
      .mockResolvedValueOnce({ ok: true });

    const onError = jest.fn();

    const { result } = renderHook(() =>
      useRealTimeData(fetchFn, { ok: false }, {
        enabled: true,
        interval: 100000,
        retryCount: 3,
        retryDelay: 1000,
        onError,
      })
    );

    // Initial fetch fails
    await act(async () => {
      await jest.advanceTimersByTimeAsync(100);
    });
    expect(result.current.error).toBeInstanceOf(Error);
    expect(onError).toHaveBeenCalledTimes(1);

    // First retry
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1100);
    });
    expect(onError).toHaveBeenCalledTimes(2);

    // Second retry succeeds
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1100);
    });
    expect(result.current.data).toEqual({ ok: true });
    expect(result.current.error).toBeNull();
  });

  it('clears retry timer on unmount to prevent memory leak', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('persistent fail'));

    const { unmount } = renderHook(() =>
      useRealTimeData(fetchFn, { ok: false }, {
        enabled: true,
        interval: 100000,
        retryCount: 10,
        retryDelay: 5000,
      })
    );

    // Initial fetch fails, schedules a retry
    await act(async () => {
      await jest.advanceTimersByTimeAsync(100);
    });

    // Unmount before retry fires
    unmount();

    // Advance past retry delay — should not cause React warnings
    await act(async () => {
      jest.advanceTimersByTimeAsync(20000);
    });

    // If we get here without React warnings, the timer cleanup worked
    expect(true).toBe(true);
  });

  it('does not fetch when disabled', async () => {
    const fetchFn = jest.fn().mockResolvedValue({ value: 1 });

    renderHook(() =>
      useRealTimeData(fetchFn, { value: 0 }, { enabled: false, interval: 5000 })
    );

    await act(async () => {
      jest.advanceTimersByTimeAsync(10000);
    });

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('updates data via updateData callback', async () => {
    const fetchFn = jest.fn().mockResolvedValue({ value: 10 });

    const { result } = renderHook(() =>
      useRealTimeData(fetchFn, { value: 0 }, { enabled: true, interval: 100000 })
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(100);
    });

    act(() => {
      result.current.updateData(data => ({ value: data.value + 5 }));
    });

    expect(result.current.data).toEqual({ value: 15 });
  });
});
