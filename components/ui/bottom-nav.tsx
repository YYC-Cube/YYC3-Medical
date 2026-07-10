'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Stethoscope, Users, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * BottomNav — 移动端底部导航栏 (多端适配规范 §4.3)
 *
 * 仅在 xs/sm 断点 (<768px) 显示，提供五个核心功能的快捷入口。
 * 遵循医疗级色彩系统（深海蓝 + 信任蓝），禁用纯黑。
 * 集成 safe-area-inset 适配全面屏 / 刘海屏。
 */

interface NavTab {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_TABS: NavTab[] = [
  { title: '主页', href: '/', icon: Home },
  { title: '诊断', href: '/ai-diagnosis', icon: Stethoscope },
  { title: '患者', href: '/patients', icon: Users },
  { title: '分析', href: '/analytics', icon: BarChart3 },
  { title: '我的', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = React.useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg safe-x safe-bottom"
      aria-label="移动端主导航"
      role="navigation"
    >
      <ul className="flex items-stretch justify-around h-16">
        {PRIMARY_TABS.map(tab => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-full touch-target transition-colors duration-200',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={cn('h-5 w-5 transition-transform duration-200', active && 'scale-110')}
                />
                <span className="text-[10px] font-medium leading-none">{tab.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
