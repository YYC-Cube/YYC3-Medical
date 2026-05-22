import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '@/lib/db';

async function exportAuditPDF() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository('audit_reports');
  const records = await repo.find({ order: { timestamp: 'DESC' }, take: 50 });

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 2rem; }
          h1 { color: #2c3e50; }
          .record { margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 1rem; }
          .status { font-weight: bold; color: green; }
          .status.error { color: red; }
        </style>
      </head>
      <body>
        <h1>🧪 审查报告</h1>
        ${records.map(r => `
          <div class="record">
            <h2>${r.entity_name}.${r.column_name}</h2>
            <p>📅 时间: ${new Date(r.timestamp).toLocaleString()}</p>
            <p>📦 表: ${r.table_name}</p>
            <p>🔠 类型: 实体(${r.entity_type}) vs 数据库(${r.db_type})</p>
            <p class="status ${r.status !== '一致' ? 'error' : ''}">✅ 状态: ${r.status}</p>
          </div>
        `).join('')}
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(process.cwd(), 'public', 'audit-report.pdf');
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();

  console.log('✅ PDF 审查报告已生成:', pdfPath);
  await AppDataSource.destroy();
}

exportAuditPDF();
