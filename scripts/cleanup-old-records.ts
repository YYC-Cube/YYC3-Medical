import { AppDataSource } from '@/lib/db';
import { LessThan } from 'typeorm';
import { AuditReport } from '@/entities/AuditReport';
import { CiAuditStatus } from '@/entities/CiAuditStatus';
import { ReportSignature } from '@/entities/ReportSignature';

async function cleanup() {
  await AppDataSource.initialize();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // 清理 audit_reports
  const auditRepo = AppDataSource.getRepository(AuditReport);
  const auditDeleted = await auditRepo.delete({
    timestamp: LessThan(sixMonthsAgo),
    status: '一致',
  });
  console.log(`✅ 清理 audit_reports: ${auditDeleted.affected} 条`);

  // 清理 ci_audit_status
  const ciRepo = AppDataSource.getRepository(CiAuditStatus);
  const ciDeleted = await ciRepo.delete({ timestamp: LessThan(oneYearAgo) });
  console.log(`✅ 清理 ci_audit_status: ${ciDeleted.affected} 条`);

  // 清理 report_signatures（可扩展为未下载记录）
  const sigRepo = AppDataSource.getRepository(ReportSignature);
  const sigDeleted = await sigRepo.delete({ timestamp: LessThan(oneYearAgo) });
  console.log(`✅ 清理 report_signatures: ${sigDeleted.affected} 条`);

  await AppDataSource.destroy();
}

cleanup();
