import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '账号安全 | YYC³-Med',
  description:
    'YYC³-Med AI-Powered Intelligent Medical System. 言启立方于万象，语枢智云守健康. Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health',
};

import { PageHeader } from '@/components/page-header';
import { Shield } from 'lucide-react';
import { AccountSecurityClient } from '@/components/security/account-security-client';

export default function AccountSecurityPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="账号安全"
        description="管理您的密码和安全设置"
        icon={<Shield className="h-6 w-6" />}
      />
      <AccountSecurityClient />
    </div>
  );
}
