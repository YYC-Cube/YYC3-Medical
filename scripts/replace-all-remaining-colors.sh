#!/bin/bash

# 批量替换所有剩余文件中的硬编码颜色

cd /Users/yanyu/YYC-Cube/YYC3-Medical

echo "开始批量替换所有剩余硬编码颜色..."

# 查找所有 .tsx 文件（排除 node_modules、.next、out 目录）
find . -name "*.tsx" -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./out/*" | while read file; do
  # 蓝色系替换
  sed -i '' \
    -e 's/text-blue-500/text-primary/g' \
    -e 's/text-blue-600/text-primary/g' \
    -e 's/text-blue-700/text-primary/g' \
    -e 's/bg-blue-50/bg-primary\/5/g' \
    -e 's/bg-blue-100/bg-primary\/10/g' \
    -e 's/bg-blue-500/bg-primary/g' \
    -e 's/bg-blue-500\/20/bg-primary\/20/g' \
    -e 's/border-blue-200/border-primary\/20/g' \
    -e 's/border-blue-500/border-primary/g' \
    "$file"

  # 灰色系替换
  sed -i '' \
    -e 's/text-gray-500/text-muted-foreground/g' \
    -e 's/text-gray-600/text-muted-foreground/g' \
    -e 's/text-gray-700/text-foreground/g' \
    -e 's/text-gray-800/text-foreground/g' \
    -e 's/bg-gray-50/bg-muted\/5/g' \
    -e 's/bg-gray-100/bg-muted\/10/g' \
    -e 's/bg-gray-500/bg-muted/g' \
    -e 's/border-gray-200/border-border/g' \
    -e 's/border-gray-300/border-border/g' \
    "$file"

  # 绿色系替换
  sed -i '' \
    -e 's/bg-green-50/bg-success\/5/g' \
    -e 's/bg-green-100/bg-success\/10/g' \
    -e 's/bg-green-500/bg-success/g' \
    -e 's/text-green-500/text-success/g' \
    -e 's/text-green-600/text-success/g' \
    -e 's/text-green-700/text-success/g' \
    -e 's/border-green-200/border-success\/20/g' \
    -e 's/border-green-500/border-success/g' \
    "$file"

  # 红色系替换
  sed -i '' \
    -e 's/bg-red-50/bg-destructive\/5/g' \
    -e 's/bg-red-100/bg-destructive\/10/g' \
    -e 's/bg-red-500/bg-destructive/g' \
    -e 's/text-red-500/text-destructive/g' \
    -e 's/text-red-600/text-destructive/g' \
    -e 's/text-red-700/text-destructive/g' \
    -e 's/border-red-200/border-destructive\/20/g' \
    -e 's/border-red-500/border-destructive/g' \
    "$file"

  # 黄色系替换
  sed -i '' \
    -e 's/bg-yellow-50/bg-warning\/5/g' \
    -e 's/bg-yellow-100/bg-warning\/10/g' \
    -e 's/bg-yellow-500/bg-warning/g' \
    -e 's/text-yellow-500/text-warning/g' \
    -e 's/text-yellow-600/text-warning/g' \
    -e 's/text-yellow-700/text-warning/g' \
    -e 's/border-yellow-200/border-warning\/20/g' \
    -e 's/border-yellow-500/border-warning/g' \
    "$file"

  # 紫色系替换
  sed -i '' \
    -e 's/bg-purple-50/bg-primary\/5/g' \
    -e 's/bg-purple-100/bg-primary\/10/g' \
    -e 's/bg-purple-500/bg-primary/g' \
    -e 's/text-purple-500/text-primary/g' \
    -e 's/text-purple-600/text-primary/g' \
    -e 's/border-purple-200/border-primary\/20/g' \
    -e 's/border-purple-500/border-primary/g' \
    "$file"

  # 橙色系替换
  sed -i '' \
    -e 's/bg-orange-50/bg-warning\/5/g' \
    -e 's/bg-orange-100/bg-warning\/10/g' \
    -e 's/bg-orange-500/bg-warning/g' \
    -e 's/text-orange-500/text-warning/g' \
    -e 's/text-orange-600/text-warning/g' \
    -e 's/border-orange-200/border-warning\/20/g' \
    -e 's/border-orange-500/border-warning/g' \
    "$file"

  # 粉色系替换
  sed -i '' \
    -e 's/bg-pink-50/bg-destructive\/5/g' \
    -e 's/bg-pink-100/bg-destructive\/10/g' \
    -e 's/bg-pink-500/bg-destructive/g' \
    -e 's/text-pink-500/text-destructive/g' \
    -e 's/text-pink-600/text-destructive/g' \
    -e 's/border-pink-200/border-destructive\/20/g' \
    -e 's/border-pink-500/border-destructive/g' \
    "$file"

  # 靛蓝色系替换
  sed -i '' \
    -e 's/bg-indigo-50/bg-primary\/5/g' \
    -e 's/bg-indigo-100/bg-primary\/10/g' \
    -e 's/bg-indigo-500/bg-primary/g' \
    -e 's/text-indigo-500/text-primary/g' \
    -e 's/text-indigo-600/text-primary/g' \
    -e 's/border-indigo-200/border-primary\/20/g' \
    -e 's/border-indigo-500/border-primary/g' \
    "$file"

  # 青色系替换
  sed -i '' \
    -e 's/bg-teal-50/bg-success\/5/g' \
    -e 's/bg-teal-100/bg-success\/10/g' \
    -e 's/bg-teal-500/bg-success/g' \
    -e 's/text-teal-500/text-success/g' \
    -e 's/text-teal-600/text-success/g' \
    -e 's/border-teal-200/border-success\/20/g' \
    -e 's/border-teal-500/border-success/g' \
    "$file"

  # 青绿色系替换
  sed -i '' \
    -e 's/bg-cyan-50/bg-primary\/5/g' \
    -e 's/bg-cyan-100/bg-primary\/10/g' \
    -e 's/bg-cyan-500/bg-primary/g' \
    -e 's/text-cyan-500/text-primary/g' \
    -e 's/text-cyan-600/text-primary/g' \
    -e 's/border-cyan-200/border-primary\/20/g' \
    -e 's/border-cyan-500/border-primary/g' \
    "$file"
done

echo "所有剩余硬编码颜色替换完成！"
