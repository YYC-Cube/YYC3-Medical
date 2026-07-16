import type { Metadata } from 'next';
import { PatientsClientPage } from '@/components/patients/patients-client-page';

export const metadata: Metadata = {
  title: '患者管理',
  description: '患者信息管理系统',
};

export default function PatientsPage() {
  return <PatientsClientPage />;
}
