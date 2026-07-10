#!/bin/bash
# 批量替换剩余十六进制颜色为医疗主题色

cd /Users/yanyu/YYC-Cube/YYC3-Medical

echo "开始替换剩余十六进制颜色..."

# 蓝色系 (primary)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#0ea5e9/var(--primary)/g' \
  -e 's/#0EA5E9/var(--primary)/g' \
  -e 's/#3b82f6/var(--primary)/g' \
  -e 's/#3B82F6/var(--primary)/g' \
  -e 's/#0088FE/var(--primary)/g' \
  -e 's/#0088fe/var(--primary)/g' \
  -e 's/#1890ff/var(--primary)/g' \
  -e 's/#1890FF/var(--primary)/g' \
  -e 's/#0066cc/var(--primary)/g' \
  -e 's/#0066CC/var(--primary)/g' \
  {} +

# 绿色系 (success)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#22c55e/var(--success)/g' \
  -e 's/#22C55E/var(--success)/g' \
  -e 's/#00C49F/var(--success)/g' \
  -e 's/#00c49f/var(--success)/g' \
  -e 's/#4ade80/var(--success)/g' \
  -e 's/#4ADE80/var(--success)/g' \
  {} +

# 黄色/琥珀色系 (warning)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#FFBB28/var(--warning)/g' \
  -e 's/#ffbb28/var(--warning)/g' \
  -e 's/#faad14/var(--warning)/g' \
  -e 's/#FAAD14/var(--warning)/g' \
  -e 's/#facc15/var(--warning)/g' \
  -e 's/#FACC15/var(--warning)/g' \
  -e 's/#eab308/var(--warning)/g' \
  -e 's/#EAB308/var(--warning)/g' \
  {} +

# 红色系 (destructive)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#ff4d4f/var(--destructive)/g' \
  -e 's/#FF4D4F/var(--destructive)/g' \
  -e 's/#f43f5e/var(--destructive)/g' \
  -e 's/#F43F5E/var(--destructive)/g' \
  -e 's/#ff0000/var(--destructive)/g' \
  -e 's/#FF0000/var(--destructive)/g' \
  {} +

# 橙色系 (warning)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#FF8042/var(--warning)/g' \
  -e 's/#ff8042/var(--warning)/g' \
  -e 's/#ff7300/var(--warning)/g' \
  -e 's/#FF7300/var(--warning)/g' \
  {} +

# 灰色系 (muted-foreground)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#6b7280/var(--muted-foreground)/g' \
  -e 's/#6B7280/var(--muted-foreground)/g' \
  {} +

# 紫色系 (primary)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#722ed1/var(--primary)/g' \
  -e 's/#722ED1/var(--primary)/g' \
  {} +

# 白色系 (background/foreground)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#ffffff/var(--background)/g' \
  -e 's/#FFFFFF/var(--background)/g' \
  -e 's/#fff/var(--background)/g' \
  -e 's/#FFF/var(--background)/g' \
  {} +

# 浅蓝色系 (primary 变体)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#e0f2fe/var(--primary)\/10/g' \
  -e 's/#E0F2FE/var(--primary)\/10/g' \
  -e 's/#bfdbfe/var(--primary)\/20/g' \
  -e 's/#BFDBFE/var(--primary)\/20/g' \
  -e 's/#93c5fd/var(--primary)\/30/g' \
  -e 's/#93C5FD/var(--primary)\/30/g' \
  -e 's/#60a5fa/var(--primary)\/40/g' \
  -e 's/#60A5FA/var(--primary)\/40/g' \
  -e 's/#7dd3fc/var(--primary)\/50/g' \
  -e 's/#7DD3FC/var(--primary)\/50/g' \
  -e 's/#38bdf8/var(--primary)\/60/g' \
  -e 's/#38BDF8/var(--primary)\/60/g' \
  {} +

echo "剩余十六进制颜色替换完成！"
