/**
 * 可点击 div 的无障碍辅助函数
 *
 * 用法：将 <div onClick={fn}> 改为 <div onClick={fn} {...clickableDivProps(fn)}>
 * 自动添加 role="button"、tabIndex={0} 和 onKeyDown(Enter/Space)
 */

import type { KeyboardEvent } from 'react';

export function clickableDivProps(onClick?: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
  };
}
