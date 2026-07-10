#!/bin/bash
# 批量替换十六进制颜色为医疗主题色

cd /Users/yanyu/YYC-Cube/YYC3-Medical

echo "开始替换十六进制颜色..."

# 医疗蓝色系 (#2b6cb0 及其变体)
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#2b6cb0/var(--primary)/g' \
  -e 's/#2B6CB0/var(--primary)/g' \
  -e 's/#3182ce/var(--primary)/g' \
  -e 's/#3182CE/var(--primary)/g' \
  -e 's/#4299e1/var(--primary)/g' \
  -e 's/#4299E1/var(--primary)/g' \
  -e 's/#63b3ed/var(--primary)/g' \
  -e 's/#63B3ED/var(--primary)/g' \
  {} +

# 成功绿色系
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#10b981/var(--success)/g' \
  -e 's/#10B981/var(--success)/g' \
  -e 's/#059669/var(--success)/g' \
  -e 's/#059669/var(--success)/g' \
  -e 's/#34d399/var(--success)/g' \
  -e 's/#34D399/var(--success)/g' \
  {} +

# 警告琥珀色系
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#f59e0b/var(--warning)/g' \
  -e 's/#F59E0B/var(--warning)/g' \
  -e 's/#d97706/var(--warning)/g' \
  -e 's/#D97706/var(--warning)/g' \
  -e 's/#fbbf24/var(--warning)/g' \
  -e 's/#FBBF24/var(--warning)/g' \
  {} +

# 错误红色系
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#ef4444/var(--destructive)/g' \
  -e 's/#EF4444/var(--destructive)/g' \
  -e 's/#dc2626/var(--destructive)/g' \
  -e 's/#DC2626/var(--destructive)/g' \
  -e 's/#f87171/var(--destructive)/g' \
  -e 's/#F87171/var(--destructive)/g' \
  {} +

# 次要灰色系
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#94a3b8/var(--muted-foreground)/g' \
  -e 's/#94A3B8/var(--muted-foreground)/g' \
  -e 's/#64748b/var(--muted-foreground)/g' \
  -e 's/#64748B/var(--muted-foreground)/g' \
  -e 's/#cbd5e1/var(--muted)/g' \
  -e 's/#CBD5E1/var(--muted)/g' \
  {} +

# 紫色系（映射到 primary）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#8b5cf6/var(--primary)/g' \
  -e 's/#8B5CF6/var(--primary)/g' \
  -e 's/#7c3aed/var(--primary)/g' \
  -e 's/#7C3AED/var(--primary)/g' \
  -e 's/#a78bfa/var(--primary)/g' \
  -e 's/#A78BFA/var(--primary)/g' \
  {} +

# 青色系（映射到 primary）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#06b6d4/var(--primary)/g' \
  -e 's/#06B6D4/var(--primary)/g' \
  -e 's/#0891b2/var(--primary)/g' \
  -e 's/#0891B2/var(--primary)/g' \
  -e 's/#22d3ee/var(--primary)/g' \
  -e 's/#22D3EE/var(--primary)/g' \
  {} +

# 粉色系（映射到 destructive）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#ec4899/var(--destructive)/g' \
  -e 's/#EC4899/var(--destructive)/g' \
  -e 's/#db2777/var(--destructive)/g' \
  -e 's/#DB2777/var(--destructive)/g' \
  -e 's/#f472b6/var(--destructive)/g' \
  -e 's/#F472B6/var(--destructive)/g' \
  {} +

# 橙色系（映射到 warning）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#f97316/var(--warning)/g' \
  -e 's/#F97316/var(--warning)/g' \
  -e 's/#ea580c/var(--warning)/g' \
  -e 's/#EA580C/var(--warning)/g' \
  -e 's/#fb923c/var(--warning)/g' \
  -e 's/#FB923C/var(--warning)/g' \
  {} +

# 靛蓝色系（映射到 primary）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#4f46e5/var(--primary)/g' \
  -e 's/#4F46E5/var(--primary)/g' \
  -e 's/#4338ca/var(--primary)/g' \
  -e 's/#4338CA/var(--primary)/g' \
  -e 's/#6366f1/var(--primary)/g' \
  -e 's/#6366F1/var(--primary)/g' \
  {} +

# 青绿色系（映射到 success）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#14b8a6/var(--success)/g' \
  -e 's/#14B8A6/var(--success)/g' \
  -e 's/#0d9488/var(--success)/g' \
  -e 's/#0D9488/var(--success)/g' \
  -e 's/#2dd4bf/var(--success)/g' \
  -e 's/#2DD4BF/var(--success)/g' \
  {} +

# 酸橙色系（映射到 success）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#84cc16/var(--success)/g' \
  -e 's/#84CC16/var(--success)/g' \
  -e 's/#65a30d/var(--success)/g' \
  -e 's/#65A30D/var(--success)/g' \
  -e 's/#a3e635/var(--success)/g' \
  -e 's/#A3E635/var(--success)/g' \
  {} +

# 玫红色系（映射到 destructive）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#e11d48/var(--destructive)/g' \
  -e 's/#E11D48/var(--destructive)/g' \
  -e 's/#be123c/var(--destructive)/g' \
  -e 's/#BE123C/var(--destructive)/g' \
  -e 's/#fb7185/var(--destructive)/g' \
  -e 's/#FB7185/var(--destructive)/g' \
  {} +

# 紫罗兰色系（映射到 primary）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#8b5cf6/var(--primary)/g' \
  -e 's/#8B5CF6/var(--primary)/g' \
  -e 's/#7c3aed/var(--primary)/g' \
  -e 's/#7C3AED/var(--primary)/g' \
  -e 's/#a78bfa/var(--primary)/g' \
  -e 's/#A78BFA/var(--primary)/g' \
  {} +

# 紫红色系（映射到 primary）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#d946ef/var(--primary)/g' \
  -e 's/#D946EF/var(--primary)/g' \
  -e 's/#c026d3/var(--primary)/g' \
  -e 's/#C026D3/var(--primary)/g' \
  -e 's/#e879f9/var(--primary)/g' \
  -e 's/#E879F9/var(--primary)/g' \
  {} +

# 翠绿色系（映射到 success）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#059669/var(--success)/g' \
  -e 's/#059669/var(--success)/g' \
  -e 's/#047857/var(--success)/g' \
  -e 's/#047857/var(--success)/g' \
  -e 's/#34d399/var(--success)/g' \
  -e 's/#34D399/var(--success)/g' \
  {} +

# 琥珀色系（映射到 warning）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#f59e0b/var(--warning)/g' \
  -e 's/#F59E0B/var(--warning)/g' \
  -e 's/#d97706/var(--warning)/g' \
  -e 's/#D97706/var(--warning)/g' \
  -e 's/#fbbf24/var(--warning)/g' \
  -e 's/#FBBF24/var(--warning)/g' \
  {} +

# 玫红色系（映射到 destructive）
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#e11d48/var(--destructive)/g' \
  -e 's/#E11D48/var(--destructive)/g' \
  -e 's/#be123c/var(--destructive)/g' \
  -e 's/#BE123C/var(--destructive)/g' \
  -e 's/#fb7185/var(--destructive)/g' \
  -e 's/#FB7185/var(--destructive)/g' \
  {} +

# 其他常见颜色映射
find components -name "*.tsx" -exec sed -i '' -E \
  -e 's/#8884d8/var(--primary)/g' \
  -e 's/#8884D8/var(--primary)/g' \
  -e 's/#82ca9d/var(--success)/g' \
  -e 's/#82CA9D/var(--success)/g' \
  -e 's/#ffc658/var(--warning)/g' \
  -e 's/#FFC658/var(--warning)/g' \
  {} +

echo "十六进制颜色替换完成！"
