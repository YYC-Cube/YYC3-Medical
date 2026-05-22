import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '数据安全与访问控制 | YYC³-Med',
  description:
    'YYC³-Med AI-Powered Intelligent Medical System. 言启立方于万象，语枢智云守健康. Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health',
};

import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/error-boundary';
import SecurityClient from '@/components/security/security-client';

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">数据安全与访问控制</h1>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <SecurityClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
