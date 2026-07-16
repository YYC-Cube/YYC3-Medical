import { renderHook, act } from '@testing-library/react';

describe('hooks/useOfflineStatus', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
      writable: true,
    });
  });

  it('returns online by default', () => {
    const { useOfflineStatus } = require('@/hooks/use-offline-status');
    const { result } = renderHook(() => useOfflineStatus());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
    expect(result.current.wasOffline).toBe(false);
  });

  it('detects offline status', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
      writable: true,
    });

    const { useOfflineStatus } = require('@/hooks/use-offline-status');
    const { result } = renderHook(() => useOfflineStatus());

    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  it('transitions to offline and back to online', () => {
    const { useOfflineStatus } = require('@/hooks/use-offline-status');
    const { result } = renderHook(() => useOfflineStatus());

    // go offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
    expect(result.current.wasOffline).toBe(true);

    // go back online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
    expect(result.current.wasOffline).toBe(false);
  });
});