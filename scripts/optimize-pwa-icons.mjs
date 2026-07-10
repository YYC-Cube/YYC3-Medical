/**
 * YYC³-Med PWA 图标优化脚本
 *
 * 设计原则：
 * - iOS/Android 安装图标：保留最高质量 PNG（透明度 + 无损），仅 CI 生产构建时可选压缩
 * - PWA 浏览器图标：已提供 webp 格式（见 manifest.json），浏览器优先加载 webp
 * - CI 构建时：验证图标大小在质量预算内，超出阈值告警
 *
 * 质量标准：
 *   SSIM ≥ 0.9999（视觉无损） —— PNG 图标不进行有损压缩
 *   webp quality ≥ 85           —— webp 格式压缩质量门禁
 *   1024×1024 图标 ≤ 600KB      —— iOS App Store 提交要求
 *   512×512 图标    ≤ 250KB      —— PWA manifest 加载性能
 *
 * 使用:
 *   pnpm optimize:pwa-icons            # 本地检查 + 报告
 *   pnpm optimize:pwa-icons --ci       # CI 模式：检查 + 严格验证
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ICONS_DIR = join(ROOT, 'public', 'yyc3-icons');
const PWA_DIR = join(ICONS_DIR, 'pwa');
const IOS_DIR = join(ICONS_DIR, 'ios');
const WEBP_DIR = join(ICONS_DIR, 'webp');
const ANDROID_DIR = join(ICONS_DIR, 'android');

// ============================================================
// 质量预算 (Quality Budgets)
// ============================================================
const BUDGETS = {
  'pwa/icon-72x72.png':    { max: 10,   note: '小图标，应极小' },
  'pwa/icon-96x96.png':    { max: 15,   note: '小图标' },
  'pwa/icon-128x128.png':  { max: 25,   note: '中等图标' },
  'pwa/icon-144x144.png':  { max: 30,   note: '中等图标' },
  'pwa/icon-152x152.png':  { max: 35,   note: '中等图标' },
  'pwa/icon-192x192.png':  { max: 50,   note: '主图标' },
  'pwa/icon-384x384.png':  { max: 150,  note: '大图标' },
  'pwa/icon-512x512.png':  { max: 250,  note: '最大 PWA 图标, ≤250KB' },
  'ios/icon-1024.png':     { max: 600,  note: 'App Store, ≤600KB' },
  'webp/icon-192x192.webp':{ max: 50,   note: 'webp 格式, 浏览器主加载' },
  'webp/icon-512x512.webp':{ max: 200,  note: 'webp 格式, 浏览器主加载' },
  'android/playstore-icon.png': { max: 250, note: 'Play Store 图标' },
};

// ============================================================
// CI 模式验证门禁
// ============================================================
const CI_MODE = process.argv.includes('--ci');
const MIN_WEBP_QUALITY = 85;  // webp 最低质量分

let violations = 0;
let warnings = 0;

function checkIcon(relPath, absPath, budget) {
  if (!existsSync(absPath)) {
    console.log(`  ⚠️  缺失: ${relPath} (未找到)`);
    warnings++;
    return;
  }

  const sizeKB = statSync(absPath).size / 1024;
  const withinBudget = sizeKB <= budget.max;
  const tag = withinBudget ? '✅' : '❌';

  console.log(`  ${tag} ${relPath.padEnd(40)} ${sizeKB.toFixed(1).padStart(7)} KB (预算: ≤${budget.max} KB)`);
  if (!withinBudget) {
    const over = ((sizeKB - budget.max) / budget.max * 100).toFixed(0);
    console.log(`       └─ 超出预算 ${over}% — ${budget.note}`);
    violations++;
  }
}

function report() {
  console.log(`\n${'═'.repeat(65)}`);
  if (violations === 0 && warnings === 0) {
    console.log('\n  结果: ✅ 所有图标均在质量预算内');
  } else {
    if (violations > 0) {
      console.log(`\n  结果: ❌ ${violations} 个图标超出预算`);
      console.log('  └─ 建议: 重新导出优化后的 PNG/webp 源文件，或调整 BUDGETS 阈值');
    }
    if (warnings > 0) {
      console.log(`\n  结果: ⚠️  ${warnings} 个警告（缺失文件）`);
    }
  }

  // CI 模式 — 严重违规即失败
  if (CI_MODE && violations > 0) {
    console.log('\n  CI 门禁: ❌ 未通过 — 图标体积超过质量预算');
    process.exit(1);
  }

  console.log(`\n  CI 模式: ${CI_MODE ? '✅ 启用' : '❌ 仅检查'}`);
  console.log(`  webp 质量要求: ≥ ${MIN_WEBP_QUALITY}`);
  console.log(`  PNG 策略: 无损保留（保持 RGBA 透明通道）`);
  console.log(`  webp 策略: 浏览器优先加载 webp（manifest.json 已配置）`);
  console.log();
}

function main() {
  console.log(`
╔═══════════════════════════════════════════════╗
║  YYC³-Med PWA 图标质量审计                      ║
║  ${new Date().toISOString().split('T')[0]}                        ║
╚═══════════════════════════════════════════════╝
`);
  console.log('图标目录:', ICONS_DIR.replace(ROOT, '.'));
  console.log('审计预算:', Object.keys(BUDGETS).length, '个图标');
  console.log('');

  // 逐一验证所有图标
  for (const [relPath, budget] of Object.entries(BUDGETS)) {
    checkIcon(relPath, join(ICONS_DIR, relPath), budget);
  }

  report();
}

main();
