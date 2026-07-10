import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * ============================================================================
 * YYC³-Med 医疗级安全头配置 (Security Headers)
 * ============================================================================
 * 注意：当前项目使用 output: 'export'（静态导出），headers() 仅在
 * Next.js 服务端渲染模式下生效。静态部署时（GitHub Pages / CDN），
 * 请将以下安全头配置在 CDN/反向代理层（如 Cloudflare、Nginx）。
 *
 * 等保三级 / HIPAA 合规必须包含以下头：
 *   - Content-Security-Policy
 *   - Strict-Transport-Security
 *   - X-Content-Type-Options
 *   - X-Frame-Options
 *   - Referrer-Policy
 *   - Permissions-Policy
 * ============================================================================
 */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), display-capture=(), clipboard-read=(self), clipboard-write=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: placeholder.svg",
      "font-src 'self' data:",
      "connect-src 'self' https://api.deepseek.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

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

  turbopack: {
    root: __dirname,
  },

  compress: true,

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
