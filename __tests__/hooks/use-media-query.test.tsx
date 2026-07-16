import { renderHook } from '@testing-library/react';

// Mock matchMedia before importing the hook
const mockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('hooks/useMediaQuery', () => {
  beforeEach(() => {
    (window as any).matchMedia = mockMatchMedia(true);
  });

  it('returns true when query matches', () => {
    const { useMediaQuery } = require('@/hooks/useMediaQuery');
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when query does not match', () => {
    (window as any).matchMedia = mockMatchMedia(false);
    const { useMediaQuery } = require('@/hooks/useMediaQuery');
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });
});
