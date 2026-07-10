#!/bin/bash

# 批量替换 app 目录下的硬编码颜色为 CSS 变量

cd /Users/yanyu/YYC-Cube/YYC3-Medical

echo "开始替换 app 目录下的硬编码颜色..."

# 蓝色系替换
find app -name "*.tsx" -exec sed -i '' \
  -e 's/text-blue-500/text-primary/g' \
  -e 's/text-blue-600/text-primary/g' \
  -e 's/text-blue-700/text-primary/g' \
  -e 's/bg-blue-50/bg-primary\/5/g' \
  -e 's/bg-blue-100/bg-primary\/10/g' \
  -e 's/bg-blue-500/bg-primary/g' \
  -e 's/border-blue-200/border-primary\/20/g' \
  -e 's/border-blue-500/border-primary/g' \
  {} +

# 灰色系替换
find app -name "*.tsx" -exec sed -i '' \
  -e 's/text-gray-500/text-muted-foreground/g' \
  -e 's/text-gray-600/text-muted-foreground/g' \
  -e 's/text-gray-700/text-foreground/g' \
  -e 's/text-gray-800/text-foreground/g' \
  -e 's/bg-gray-50/bg-muted\/5/g' \
  -e 's/bg-gray-100/bg-muted\/10/g' \
  -e 's/bg-gray-500/bg-muted/g' \
  -e 's/border-gray-200/border-border/g' \
  -e 's/border-gray-300/border-border/g' \
  {} +

# 绿色系替换
find app -name "*.tsx" -exec sed -i '' \
  -e 's/bg-success-100/bg-success\/10/g' \
  -e 's/text-success-800/text-success/g' \
  -e 's/bg-success-500/bg-success/g' \
  {} +

echo "app 目录颜色替换完成！"
