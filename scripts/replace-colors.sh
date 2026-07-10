#!/bin/bash
# 批量替换硬编码颜色为 CSS 变量 - macOS 兼容版本

cd /Users/yanyu/YYC-Cube/YYC3-Medical

echo "开始替换硬编码颜色..."

# 蓝色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-blue-[0-9]+/text-primary/g' \
  -e 's/bg-blue-[0-9]+/bg-primary/g' \
  -e 's/border-blue-[0-9]+/border-primary/g' \
  -e 's/hover:bg-blue-[0-9]+/hover:bg-primary/g' \
  -e 's/hover:text-blue-[0-9]+/hover:text-primary/g' \
  -e 's/hover:border-blue-[0-9]+/hover:border-primary/g' \
  {} +

# 灰色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-gray-[0-9]+/text-muted-foreground/g' \
  -e 's/bg-gray-[0-9]+/bg-muted/g' \
  -e 's/border-gray-[0-9]+/border-border/g' \
  -e 's/hover:bg-gray-[0-9]+/hover:bg-muted/g' \
  -e 's/hover:text-gray-[0-9]+/hover:text-foreground/g' \
  -e 's/hover:border-gray-[0-9]+/hover:border-border/g' \
  {} +

# 绿色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-green-[0-9]+/text-success/g' \
  -e 's/bg-green-[0-9]+/bg-success/g' \
  -e 's/border-green-[0-9]+/border-success/g' \
  -e 's/hover:bg-green-[0-9]+/hover:bg-success/g' \
  -e 's/hover:text-green-[0-9]+/hover:text-success/g' \
  {} +

# 红色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-red-[0-9]+/text-destructive/g' \
  -e 's/bg-red-[0-9]+/bg-destructive/g' \
  -e 's/border-red-[0-9]+/border-destructive/g' \
  -e 's/hover:bg-red-[0-9]+/hover:bg-destructive/g' \
  -e 's/hover:text-red-[0-9]+/hover:text-destructive/g' \
  {} +

# 黄色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-yellow-[0-9]+/text-warning/g' \
  -e 's/bg-yellow-[0-9]+/bg-warning/g' \
  -e 's/border-yellow-[0-9]+/border-warning/g' \
  -e 's/hover:bg-yellow-[0-9]+/hover:bg-warning/g' \
  -e 's/hover:text-yellow-[0-9]+/hover:text-warning/g' \
  {} +

# 紫色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-purple-[0-9]+/text-primary/g' \
  -e 's/bg-purple-[0-9]+/bg-primary/g' \
  -e 's/border-purple-[0-9]+/border-primary/g' \
  {} +

# 橙色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-orange-[0-9]+/text-warning/g' \
  -e 's/bg-orange-[0-9]+/bg-warning/g' \
  -e 's/border-orange-[0-9]+/border-warning/g' \
  {} +

# 粉色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-pink-[0-9]+/text-primary/g' \
  -e 's/bg-pink-[0-9]+/bg-primary/g' \
  -e 's/border-pink-[0-9]+/border-primary/g' \
  {} +

# 靛蓝色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-indigo-[0-9]+/text-primary/g' \
  -e 's/bg-indigo-[0-9]+/bg-primary/g' \
  -e 's/border-indigo-[0-9]+/border-primary/g' \
  {} +

# 青色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-teal-[0-9]+/text-primary/g' \
  -e 's/bg-teal-[0-9]+/bg-primary/g' \
  -e 's/border-teal-[0-9]+/border-primary/g' \
  {} +

# 青绿色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-cyan-[0-9]+/text-primary/g' \
  -e 's/bg-cyan-[0-9]+/bg-primary/g' \
  -e 's/border-cyan-[0-9]+/border-primary/g' \
  {} +

# 酸橙色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-lime-[0-9]+/text-success/g' \
  -e 's/bg-lime-[0-9]+/bg-success/g' \
  -e 's/border-lime-[0-9]+/border-success/g' \
  {} +

# 翠绿色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-emerald-[0-9]+/text-success/g' \
  -e 's/bg-emerald-[0-9]+/bg-success/g' \
  -e 's/border-emerald-[0-9]+/border-success/g' \
  {} +

# 琥珀色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-amber-[0-9]+/text-warning/g' \
  -e 's/bg-amber-[0-9]+/bg-warning/g' \
  -e 's/border-amber-[0-9]+/border-warning/g' \
  {} +

# 玫红色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-rose-[0-9]+/text-destructive/g' \
  -e 's/bg-rose-[0-9]+/bg-destructive/g' \
  -e 's/border-rose-[0-9]+/border-destructive/g' \
  {} +

# 紫罗兰色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-violet-[0-9]+/text-primary/g' \
  -e 's/bg-violet-[0-9]+/bg-primary/g' \
  -e 's/border-violet-[0-9]+/border-primary/g' \
  {} +

# 紫红色系替换
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/text-fuchsia-[0-9]+/text-primary/g' \
  -e 's/bg-fuchsia-[0-9]+/bg-primary/g' \
  -e 's/border-fuchsia-[0-9]+/border-primary/g' \
  {} +

echo "颜色替换完成！"
