#!/bin/bash
# 批量替换最终剩余的十六进制颜色

cd /Users/yanyu/YYC-Cube/YYC3-Medical

echo "开始替换最终十六进制颜色..."

# 灰色系 (muted-foreground)
find components -name "*.tsx" -exec sed -i '' -E \
  -e "s/'#999'/var(--muted-foreground)/g" \
  -e 's/"#999"/var(--muted-foreground)/g' \
  -e "s/'#666'/var(--muted-foreground)/g" \
  -e 's/"#666"/var(--muted-foreground)/g' \
  -e 's/#9ca3af/var(--muted-foreground)/g' \
  -e 's/#9CA3AF/var(--muted-foreground)/g' \
  {} +

# 浅蓝色系 (primary 变体)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#E6F4FF/var(--primary)\/10/g' \
  -e 's/#e6f4ff/var(--primary)\/10/g' \
  -e 's/#00A3E0/var(--primary)/g' \
  -e 's/#00a3e0/var(--primary)/g' \
  -e 's/#005A9C/var(--primary)/g' \
  -e 's/#005a9c/var(--primary)/g' \
  {} +

# 绿色系 (success)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#00CC99/var(--success)/g' \
  -e 's/#00cc99/var(--success)/g' \
  -e 's/#28A745/var(--success)/g' \
  -e 's/#28a745/var(--success)/g' \
  {} +

# 红色系 (destructive)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#FF6B6B/var(--destructive)/g' \
  -e 's/#ff6b6b/var(--destructive)/g' \
  -e 's/#DC3545/var(--destructive)/g' \
  -e 's/#dc3545/var(--destructive)/g' \
  -e 's/#b91c1c/var(--destructive)/g' \
  -e 's/#B91C1C/var(--destructive)/g' \
  {} +

# 橙色/黄色系 (warning)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#FFB84D/var(--warning)/g' \
  -e 's/#ffb84d/var(--warning)/g' \
  -e 's/#FFC107/var(--warning)/g' \
  -e 's/#ffc107/var(--warning)/g' \
  -e 's/#bf3b04/var(--warning)/g' \
  -e 's/#BF3B04/var(--warning)/g' \
  {} +

# 紫色系 (primary)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#9966FF/var(--primary)/g' \
  -e 's/#9966ff/var(--primary)/g' \
  {} +

# 灰色系 (muted)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#4D4D4D/var(--muted-foreground)/g' \
  -e 's/#4d4d4d/var(--muted-foreground)/g' \
  -e 's/#f3f4f6/var(--muted)/g' \
  -e 's/#F3F4F6/var(--muted)/g' \
  {} +

# 信息蓝色 (primary)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#17A2B8/var(--primary)/g' \
  -e 's/#17a2b8/var(--primary)/g' \
  {} +

# 3D 按钮和卡片的阴影颜色
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#0057a5/var(--primary)/g' \
  -e 's/#bae0fd/var(--primary)\/20/g' \
  -e 's/#1b635f/var(--success)/g' \
  -e 's/#15803d/var(--success)/g' \
  {} +

echo "最终十六进制颜色替换完成！"
