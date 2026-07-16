import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '审计日志',
  description: 'YanYuCloud智能诊疗系统审计日志管理',
};

import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/error-boundary';
import AuditLogClient from '@/components/security/audit-log-client';

export default function AuditLogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">审计日志</h1>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AuditLogClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
