import fs from 'fs';
import path from 'path';

const ROUTE_DIR = './app';
const DB_ALIAS = '@/lib/db';
const ERRORS: string[] = [];

function checkRouteConflicts() {
  const dashboardPaths = [
    path.join(ROUTE_DIR, '(dashboard)/dashboard/page.tsx'),
    path.join(ROUTE_DIR, 'dashboard/page.tsx'),
  ];
  const existing = dashboardPaths.filter(p => fs.existsSync(p));
  if (existing.length > 1) {
    ERRORS.push('❌ 路由冲突: 存在多个 /dashboard 页面，请移除或重命名其中一个');
  }
}

function checkModuleAlias() {
  const apiDir = './pages/api';
  if (!fs.existsSync(apiDir)) return;
  const files = fs.readdirSync(apiDir);
  for (const file of files) {
    const content = fs.readFileSync(path.join(apiDir, file), 'utf-8');
    if (content.includes(DB_ALIAS)) {
      try {
        require.resolve(DB_ALIAS.replace('@/', './lib/'));
      } catch {
        ERRORS.push(`❌ 模块导入失败: ${file} 中无法解析 ${DB_ALIAS}`);
      }
    }
  }
}

function checkTypeScriptSyntax() {
  const file = './scripts/database/run-sql-scripts.ts';
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('main()run-sql-scripts.ts')) {
    ERRORS.push(`❌ TypeScript 语法错误: ${file} 第 207 行可能缺少分号或拼写错误`);
  }
}

function runAudit() {
  console.log('🔍 正在审查项目结构...');
  checkRouteConflicts();
  checkModuleAlias();
  checkTypeScriptSyntax();

  if (ERRORS.length === 0) {
    console.log('✅ 项目结构良好，无明显错误');
  } else {
    console.log('🚨 检测到以下问题:');
    ERRORS.forEach(e => console.log(e));
    process.exit(1); // CI 中标记为失败
  }
}

runAudit();
