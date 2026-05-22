import { AppDataSource } from '@/lib/db';

async function cleanupDB() {
  await AppDataSource.initialize();
  const auditRepo = AppDataSource.getRepository('audit_reports');
  const ciRepo = AppDataSource.getRepository('ci_audit_status');
  const sigRepo = AppDataSource.getRepository('report_signatures');

  // 清理 audit_reports
  await auditRepo.delete({
    timestamp: LessThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6)),
    status: '一致',
  });

  // 清理 ci_audit_status
  await ciRepo.delete({
    timestamp: LessThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)),
  });

  // 清理 report_signatures
  await sigRepo.delete({
    timestamp: LessThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)),
  });

  await AppDataSource.destroy();
  console.log('✅ 数据库清理完成');
}

cleanupDB();
