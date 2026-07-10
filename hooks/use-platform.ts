'use client';

import * as React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * usePlatform — 多端设备/平台统一检测 Hook (多端适配规范 §4)
 *
 * 聚合设备类型 (mobile/tablet/desktop)、PWA standalone 模式、触控能力、
 * 折叠屏、方向等维度，供组件按端能力条件渲染。
 */
export interface PlatformInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPWA: boolean;
  isStandalone: boolean;
  isTouch: boolean;
  isFoldable: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  /** 移动端或平板（非桌面） */
  isHandheld: boolean;
  /** 渲染完毕前的安全回退值 */
  isHydrating: boolean;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari standalone
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function detectTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

function detectFoldable(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(horizontal-viewport-segments: 2)').matches;
}

export function usePlatform(): PlatformInfo {
  const [isHydrating, setIsHydrating] = React.useState(true);

  React.useEffect(() => {
    setIsHydrating(false);
  }, []);

  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');

  const [isPWA, setIsPWA] = React.useState(false);
  const [isTouch, setIsTouch] = React.useState(false);
  const [isFoldable, setIsFoldable] = React.useState(false);

  React.useEffect(() => {
    setIsPWA(detectStandalone());
    setIsTouch(detectTouch());
    setIsFoldable(detectFoldable());

    const standaloneMql = window.matchMedia('(display-mode: standalone)');
    const foldableMql = window.matchMedia('(horizontal-viewport-segments: 2)');
    const pointerMql = window.matchMedia('(pointer: coarse)');

    const onStandaloneChange = () => setIsPWA(detectStandalone());
    const onFoldableChange = () => setIsFoldable(detectFoldable());
    const onPointerChange = () => setIsTouch(detectTouch());

    standaloneMql.addEventListener('change', onStandaloneChange);
    foldableMql.addEventListener('change', onFoldableChange);
    pointerMql.addEventListener('change', onPointerChange);

    return () => {
      standaloneMql.removeEventListener('change', onStandaloneChange);
      foldableMql.removeEventListener('change', onFoldableChange);
      pointerMql.removeEventListener('change', onPointerChange);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isPWA,
    isStandalone: isPWA,
    isTouch,
    isFoldable,
    isLandscape,
    isPortrait,
    isHandheld: isMobile || isTablet,
    isHydrating,
  };
}
