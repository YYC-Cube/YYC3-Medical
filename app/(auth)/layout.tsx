import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '认证',
  description: 'YanYuCloud医疗AI智能诊疗系统 - 安全登录',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
