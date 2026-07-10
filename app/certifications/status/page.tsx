import type { Metadata } from 'next';
import { CertificationStatusClient } from '@/components/certifications/certification-status-client';

export const metadata: Metadata = {
  title: '验证状态 | YanYuCloud',
  description: '查看医疗专业人员资质验证状态',
};

export default function CertificationStatusPage() {
  return <CertificationStatusClient />;
}
