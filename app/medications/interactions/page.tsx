import type { Metadata } from 'next';
import { MedicationInteractionsClient } from '@/components/medications/medication-interactions-client';

export const metadata: Metadata = {
  title: '药物互作',
  description: '药物相互作用检查与分析',
};

export default function MedicationInteractionsPage() {
  return <MedicationInteractionsClient />;
}
