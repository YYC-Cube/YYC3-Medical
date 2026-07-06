import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },

  turbopack: {
    root: __dirname,
  },

  compress: true,

  poweredByHeader: false,
};

export default nextConfig;
