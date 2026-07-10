/**
 * YYC³-Med 图片优化脚本
 *
 * 功能：
 * 1. 扫描 public/ 目录下超过阈值的 PNG/JPEG 文件
 * 2. 使用 sips (macOS 内置) 进行尺寸缩减和质量压缩
 * 3. 生成优化报告
 *
 * 使用: node scripts/optimize-images.mjs
 */

import { readdirSync, statSync, existsSync, copyFileSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const BACKUP_DIR = join(ROOT, 'public', '.originals');

// 优化阈值配置
const THRESHOLDS = {
  maxWidth: 1800,
  maxHeight: 1080,
  maxSizeKB: 200,
  quality: 85,
};

// 需要跳过的目录（PWA 图标等保留原样）
const SKIP_DIRS = ['yyc3-icons', '.originals'];

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║    YYC³-Med 图片优化工具                      ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`阈值: >${THRESHOLDS.maxSizeKB}KB | 最大尺寸: ${THRESHOLDS.maxWidth}x${THRESHOLDS.maxHeight}\n`);

  const results = [];
  const images = collectImages(PUBLIC_DIR);

  if (images.length === 0) {
    console.log('✅ 无需要优化的图片');
    return;
  }

  // 创建备份目录
  if (!existsSync(BACKUP_DIR)) {
    execSync(`mkdir -p "${BACKUP_DIR}"`);
  }

  for (const img of images) {
    const stats = statSync(img);
    const sizeKB = stats.size / 1024;
    const ext = extname(img).toLowerCase();
    const relPath = img.replace(PUBLIC_DIR + '/', '');
    const backupPath = join(BACKUP_DIR, relPath.replace(/\//g, '_'));

    if (sizeKB < THRESHOLDS.maxSizeKB) {
      continue; // 低于阈值，跳过
    }

    // 备份原始文件
    if (!existsSync(backupPath)) {
      copyFileSync(img, backupPath);
    }

    const beforeSize = sizeKB;
    let optimizedSize = 0;

    try {
      if (ext === '.png') {
        // 使用 sips 调整尺寸和压缩
        execSync(
          `sips -Z ${THRESHOLDS.maxWidth} -s formatOptions ${THRESHOLDS.quality} "${img}" --out "${img}" 2>/dev/null`, 
          { stdio: 'pipe' }
        );
      } else if (ext === '.jpg' || ext === '.jpeg') {
        execSync(
          `sips -Z ${THRESHOLDS.maxWidth} -s formatOptions ${THRESHOLDS.quality} "${img}" --out "${img}" 2>/dev/null`,
          { stdio: 'pipe' }
        );
      }

      const afterStat = statSync(img);
      optimizedSize = afterStat.size / 1024;

      results.push({
        file: relPath,
        before: beforeSize.toFixed(1),
        after: optimizedSize.toFixed(1),
        saved: ((1 - optimizedSize / beforeSize) * 100).toFixed(1),
      });
    } catch (err) {
      console.warn(`⚠️  优化失败: ${relPath} - ${err.message}`);
    }
  }

  // 输出报告
  if (results.length > 0) {
    console.log('优化结果:');
    console.log('─'.repeat(70));
    console.log(' 文件'.padEnd(50) + '压缩前'.padEnd(10) + '压缩后'.padEnd(10) + '节省');
    console.log('─'.repeat(70));

    let totalBefore = 0;
    let totalAfter = 0;

    for (const r of results) {
      console.log(` ${r.file.padEnd(48)} ${r.before.padEnd(8)}KB ${r.after.padEnd(8)}KB ${r.saved}%`);
      totalBefore += parseFloat(r.before);
      totalAfter += parseFloat(r.after);
    }

    console.log('─'.repeat(70));
    console.log(` 总计: ${results.length} 个文件 | ${totalBefore.toFixed(1)}KB → ${totalAfter.toFixed(1)}KB | 节省 ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  } else {
    console.log('✅ 所有图片已在阈值范围内');
  }
}

function collectImages(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && !SKIP_DIRS.includes(entry.name)) {
      results.push(...collectImages(fullPath));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

main().catch(console.error);
