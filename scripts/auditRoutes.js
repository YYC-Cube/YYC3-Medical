// Copilot Audit: 自动检测 app/ 目录下所有页面是否缺少 SEO 元数据

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function auditRoutes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      auditRoutes(fullPath);
    } else if (file === 'page.tsx' || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.includes('generateMetadata') && !content.includes('<Head>')) {
        console.warn(`⚠️ ${fullPath} 缺少 SEO 元数据`);
      }
    }
  }
}

auditRoutes(path.resolve(__dirname, '../app'));

console.log('✅ 路由结构与 SEO 元数据自动审查完成');
