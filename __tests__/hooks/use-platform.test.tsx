import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { usePlatform } from '@/hooks/use-platform';
import { BottomNav } from '@/components/ui/bottom-nav';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/ai-diagnosis',
}));

describe('usePlatform', () => {
  it('returns default platform info', () => {
    const { result } = renderHook(() => usePlatform());
    expect(result.current).toHaveProperty('isMobile');
    expect(result.current).toHaveProperty('isTablet');
    expect(result.current).toHaveProperty('isDesktop');
    expect(result.current).toHaveProperty('isPWA');
    expect(result.current).toHaveProperty('isTouch');
    expect(result.current).toHaveProperty('isFoldable');
    expect(result.current).toHaveProperty('isHandheld');
    expect(typeof result.current.isMobile).toBe('boolean');
  });

  it('sets isHydrating to false after mount', async () => {
    const { result } = renderHook(() => usePlatform());
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    expect(result.current.isHydrating).toBe(false);
  });

  it('isHandheld is true when mobile or tablet', () => {
    const { result } = renderHook(() => usePlatform());
    const handheld = result.current.isMobile || result.current.isTablet;
    expect(result.current.isHandheld).toBe(handheld);
  });
});

describe('BottomNav', () => {
  it('renders navigation with aria-label', () => {
    render(<BottomNav />);
    expect(screen.getByLabelText('移动端主导航')).toBeDefined();
  });

  it('renders five primary tabs', () => {
    render(<BottomNav />);
    expect(screen.getByText('主页')).toBeDefined();
    expect(screen.getByText('诊断')).toBeDefined();
    expect(screen.getByText('患者')).toBeDefined();
    expect(screen.getByText('分析')).toBeDefined();
    expect(screen.getByText('我的')).toBeDefined();
  });

  it('marks active tab with aria-current', () => {
    render(<BottomNav />);
    const activeLink = screen.getByText('诊断').closest('a');
    expect(activeLink?.getAttribute('aria-current')).toBe('page');
  });
});
