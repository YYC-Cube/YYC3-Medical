import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '合规管理 | YYC³-Med',
  description:
    'YYC³-Med AI-Powered Intelligent Medical System. 言启立方于万象，语枢智云守健康. Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health',
};

import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/error-boundary';
import ComplianceClient from '@/components/security/compliance-client';

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">合规管理</h1>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <ComplianceClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
