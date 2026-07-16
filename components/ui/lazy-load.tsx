'use client';

import type React from 'react';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense, lazy, useEffect, useState, type ComponentType } from 'react';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<unknown> }>;
  props?: Record<string, unknown>;
  fallback?: React.ReactNode;
  onLoad?: () => void;
}

export function LazyComponent({
  component,
  props = {},
  fallback = (
    <div className="w-full h-40 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
  onLoad,
}: LazyComponentProps) {
  const [Component, setComponent] = useState<ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        const mod = await component();
        if (isMounted) {
          setComponent(() => mod.default);
          onLoad?.();
        }
      } catch (error) {
        console.error('组件加载失败:', error);
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [component, onLoad]);

  if (!Component) {
    return <>{fallback}</>;
  }

  return <Component {...props} />;
}

/**
 * 创建懒加载组件
 * @param importFunc 组件导入函数
 * @param fallback 加载中显示的内容
 */
export function createLazyComponent<T extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyLoadedComponent = lazy(importFunc) as unknown as ComponentType<T>;

  return function LazyWrapper(props: T) {
    return (
      <Suspense
        fallback={
          fallback || (
            <div className="w-full h-40 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )
        }
      >
        { }
        <LazyLoadedComponent {...props} />
      </Suspense>
    );
  };
}
