'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/ui/bottom-nav';

/**
 * MobileShell — 多端响应式布局外壳 (多端适配规范 §2.1, §4.3)
 *
 * 自动根据设备类型应用安全区内边距，并在移动端渲染底部导航。
 * 桌面端仅渲染 children（底部导航隐藏）。
 *
 * 用法：
 *   <MobileShell showBottomNav>
 *     {children}
 *   </MobileShell>
 */
export interface MobileShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否显示移动端底部导航（默认 true） */
  showBottomNav?: boolean;
  /** 内容区域额外类名 */
  contentClassName?: string;
}

export function MobileShell({
  children,
  className,
  contentClassName,
  showBottomNav = true,
  ...props
}: MobileShellProps) {
  return (
    <div className={cn('min-h-dvh flex flex-col', className)} {...props}>
      <main
        className={cn(
          'flex-1 w-full medical-container safe-x',
          showBottomNav && 'pb-bottom-nav',
          contentClassName
        )}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
