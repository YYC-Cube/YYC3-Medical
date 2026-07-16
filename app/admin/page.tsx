import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata: Metadata = {
  title: '管理平台首页',
  description: '医疗系统管理平台概览',
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">管理平台</h1>
      <AdminDashboard />
    </div>
  );
}
