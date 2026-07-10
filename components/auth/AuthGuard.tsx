'use client';

import type React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  requiredRoles,
  fallback,
}: AuthGuardProps) {
  // 直接读取持久化的鉴权状态；useAuthStore 已经通过 zustand persist
  // 在 hydrate 后自动还原 token / user / isAuthenticated，
  // 不再需要手动读取 localStorage 或调用 /api/auth/verify（静态导出无后端）。
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  const allRoles = requiredRoles || (requiredRole ? [requiredRole] : []);
  const hasRequiredRole =
    allRoles.length === 0 || (user?.role != null && allRoles.includes(user.role));

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated && !hasRequiredRole) {
      router.push('/unauthorized');
    }
  }, [requireAuth, isAuthenticated, hasRequiredRole, router]);

  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )
    );
  }

  if (isAuthenticated && !hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
}
