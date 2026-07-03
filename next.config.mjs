/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  compress: true,

  poweredByHeader: false,

  // Turbopack 配置 (Next.js 16 默认使用 Turbopack)
  turbopack: {
    // 预留 Turbopack 扩展配置，当前为空表示使用默认配置
  },
};

export default nextConfig;
