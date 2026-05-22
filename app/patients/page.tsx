import type { Metadata } from 'next';
import { PatientsClientPage } from '@/components/patients/patients-client-page';

export const metadata: Metadata = {
  title: '患者管理 | YYC³-Med',
  description:
    'YYC³-Med AI-Powered Intelligent Medical System',
};

export default function PatientsPage() {
  return <PatientsClientPage />;
}
