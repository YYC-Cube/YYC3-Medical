import fs from 'fs';
import { AppDataSource } from '@/lib/db';

async function exportAuditMarkdown() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository('audit_reports');
  const records = await repo.find({ order: { timestamp: 'DESC' }, take: 50 });

  let md = `# 🧪 审查报告\n\n`;
  md += `> 最近 ${records.length} 条记录\n\n`;

  for (const r of records) {
    md += `## ${r.entity_name}.${r.column_name}\n`;
    md += `- 📅 时间: ${new Date(r.timestamp).toLocaleString()}\n`;
    md += `- 📦 表: ${r.table_name}\n`;
    md += `- 🔠 类型: 实体(${r.entity_type}) vs 数据库(${r.db_type})\n`;
    md += `- ✅ 状态: ${r.status}\n\n`;
  }

  fs.writeFileSync('audit-report.md', md);
  console.log('✅ Markdown 审查报告已生成');
  await AppDataSource.destroy();
}

exportAuditMarkdown();
