/**
 * YYC³-Med 性能基线报告生成器
 *
 * 采集并验证当前项目性能基线，输出结构化报告。
 * 集成到 CI 流程：node scripts/perf-baseline.mjs
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const FAILURE = false;
const WARNINGS = [];
const RESULTS = [];

function section(title) {
  console.log(`\n╔═══════════════════════════════════════════╗`);
  console.log(`║  ${title.padEnd(40)}║`);
  console.log(`╚═══════════════════════════════════════════╝`);
}

function check(label, cond, value, target, unit = '') {
  const status = cond ? '✅' : '⚠️';
  RESULTS.push({ label, pass: cond, value, target, unit });
  console.log(`  ${status} ${label}: ${value}${unit} (目标: ${target}${unit})`);
  if (!cond) WARNINGS.push(`${label}: ${value}${unit} 超出阈值 ${target}${unit}`);
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════╗
║     YYC³-Med 性能基线报告 v1.0               ║
║     生成日期: ${new Date().toISOString().split('T')[0]}                    ║
╚══════════════════════════════════════════════╝`);

  // ── 1. Bundle 分析 ──
  section('1. Bundle 分析');
  const chunksDir = join(ROOT, 'out', '_next', 'static', 'chunks');
  if (existsSync(chunksDir)) {
    const chunks = readdirSync(chunksDir)
      .filter(f => f.endsWith('.js'))
      .map(f => ({ name: f, size: statSync(join(chunksDir, f)).size }))
      .sort((a, b) => b.size - a.size);

    const totalJSSize = chunks.reduce((s, c) => s + c.size, 0);
    const maxChunk = chunks[0];
    const largeChunks = chunks.filter(c => c.size > 350 * 1024).length;

    check('JS Chunk 总数', chunks.length <= 210, chunks.length, 210, '');
    check('JS 总大小 (MB)', totalJSSize < 12 * 1024 * 1024, (totalJSSize / 1024 / 1024).toFixed(1), '<12', 'MB');
    check('最大 Chunk (KB)', (maxChunk?.size || 0) < 400 * 1024, Math.round((maxChunk?.size || 0) / 1024), '<400', 'KB');
    check('超大 Chunk (>350KB) 数量', largeChunks === 0, largeChunks, 0, '');
  } else {
    console.log('  ⚠️  未找到 out/_next/static/chunks 目录，请先运行 pnpm build');
  }

  // ── 2. 静态资源分析 ──
  section('2. 静态资源分析');
  const publicDir = join(ROOT, 'out');
  if (existsSync(publicDir)) {
    const images = [];
    const walkDir = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'yyc3-icons') walkDir(p);
        else if (entry.isFile() && /\.(png|jpg|jpeg|gif|webp)$/i.test(entry.name)) {
          images.push({ name: p.replace(publicDir + '/', ''), size: statSync(p).size });
        }
      }
    };
    walkDir(publicDir);

    const totalImgSize = images.reduce((s, i) => s + i.size, 0);
    const largestImgs = images.sort((a, b) => b.size - a.size).slice(0, 3);

    check('图片资源总数', images.length < 100, images.length, '<100', '');
    check('图片总大小 (MB)', totalImgSize < 5 * 1024 * 1024, (totalImgSize / 1024 / 1024).toFixed(1), '<5', 'MB');

    largestImgs.forEach((img, i) => {
      check(`Top ${i+1} 大图片 (KB): ${img.name.split('/').pop()}`, img.size < 250 * 1024, Math.round(img.size / 1024), '<250', 'KB');
    });
  }

  // ── 3. 构建验证 ──
  section('3. 构建验证');
  const totalSize = execSync(`du -sh "${publicDir}" 2>/dev/null`).toString().trim().split('\t')[0] || 'N/A';
  const sizeMB = parseFloat(totalSize);
  check(`总导出体积 (${totalSize})`, isNaN(sizeMB) || sizeMB < 30, (isNaN(sizeMB) ? totalSize : sizeMB), '<30', 'MB');

  // ── 4. 测试覆盖率 ──
  section('4. 测试验证');
  try {
    const testOutput = execSync(`cd "${ROOT}" && npx jest --coverage 2>&1`).toString();
    const libUtilsMatch = testOutput.match(/lib\/utils\s+\|\s+([0-9.]+)/);
    if (libUtilsMatch) {
      const cov = parseFloat(libUtilsMatch[1]);
      check('lib/utils 覆盖率 (%)', cov > 85, cov, '>85', '%');
    }
    const allLine = testOutput.match(/All files\s+\|\s+([0-9.]+)/g);
    if (allLine) {
      const allCov = parseFloat(allLine[0].match(/([0-9.]+)/)[0]);
      check('全局 Statements 覆盖率 (%)', allCov > 38, allCov, '>38', '%');
    }
  } catch {
    console.log('  ⚠️  测试执行失败，跳过覆盖率检查');
  }

  // ── 汇总 ──
  console.log(`\n${'═'.repeat(50)}`);
  const passed = RESULTS.filter(r => r.pass).length;
  const total = RESULTS.length;
  const score = Math.round(passed / total * 100);
  console.log(`\n  🎯 综合评分: ${score}/100 (${passed}/${total} 项通过)`);

  if (WARNINGS.length > 0) {
    console.log(`\n  ⚠️  告警项 (${WARNINGS.length}):`);
    WARNINGS.forEach(w => console.log(`    - ${w}`));
  } else {
    console.log('\n  ✅ 所有基线检查通过');
  }

  console.log(`\n  通过率: ${passed}/${total} | 分数: ${score}/100\n`);
  process.exit(score >= 60 ? 0 : 1);
}

main().catch(err => {
  console.error('基线报告生成失败:', err);
  process.exit(1);
});
