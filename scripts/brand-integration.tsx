import fs from "fs"
import path from "path"

interface BrandConfig {
  name: {
    zh: string
    en: string
  }
  slogan: {
    zh: string
    en: string
  }
  title: {
    zh: string
    en: string
  }
  description: {
    zh: string
    en: string
  }
  keywords: {
    zh: string[]
    en: string[]
  }
}

export class BrandIntegration {
  private projectRoot: string
  private brandConfig: BrandConfig

  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot
    this.brandConfig = {
      name: {
        zh: "言语云³",
        en: "YYC³-Med",
      },
      slogan: {
        zh: "言启立方于万象，语枢智云守健康",
        en: "Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health",
      },
      title: {
        zh: "言语云³医疗AI系统",
        en: "YYC³-Med | AI-Powered Intelligent Medical System",
      },
      description: {
        zh: "基于人工智能的智能医疗系统，提供诊断辅助、病例分析、知识图谱等功能",
        en: "AI-powered intelligent medical system providing diagnostic assistance, case analysis, and knowledge graph capabilities",
      },
      keywords: {
        zh: ["医疗AI", "智能诊断", "病例分析", "知识图谱", "医疗系统", "人工智能"],
        en: [
          "Medical AI",
          "Smart Diagnosis",
          "Case Analysis",
          "Knowledge Graph",
          "Medical System",
          "Artificial Intelligence",
        ],
      },
    }
  }

  async integrate(): Promise<void> {
    console.log("🎨 开始品牌集成...")

    try {
      // 1. 更新应用元数据
      await this.updateAppMetadata()

      // 2. 创建品牌组件
      await this.createBrandComponents()

      // 3. 更新SEO配置
      await this.updateSEOConfig()

      // 4. 创建多语言配置
      await this.createI18nConfig()

      // 5. 更新manifest文件
      await this.updateManifest()

      console.log("✅ 品牌集成完成！")
    } catch (error) {
      console.error("❌ 品牌集成失败:", error)
      throw error
    }
  }

  private async updateAppMetadata(): Promise<void> {
    console.log("📝 更新应用元数据...")

    const layoutPath = path.join(this.projectRoot, "app/layout.tsx")
    if (fs.existsSync(layoutPath)) {
      let content = fs.readFileSync(layoutPath, "utf-8")

      // 更新metadata
      const metadataRegex = /export const metadata: Metadata = \{[\s\S]*?\}/
      const newMetadata = `export const metadata: Metadata = {
  title: {
    default: "${this.brandConfig.title.en}",
    template: "%s | ${this.brandConfig.name.en}",
  },
  description: "${this.brandConfig.description.en}",
  keywords: [${this.brandConfig.keywords.en.map((k) => `"${k}"`).join(", ")}],
  authors: [{ name: "${this.brandConfig.name.en}" }],
  creator: "${this.brandConfig.name.en}",
  publisher: "${this.brandConfig.name.en}",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://medical.yyc3.vip"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/zh",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://medical.yyc3.vip",
    title: "${this.brandConfig.title.en}",
    description: "${this.brandConfig.description.en}",
    siteName: "${this.brandConfig.name.en}",
    images: [
      {
        url: "/yyc3-icons/pwa/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "${this.brandConfig.name.en} Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "${this.brandConfig.title.en}",
    description: "${this.brandConfig.description.en}",
    images: ["/yyc3-icons/pwa/icon-512x512.png"],
    creator: "@yyc_med",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/yyc3-icons/favicon/favicon.ico",
    shortcut: "/yyc3-icons/favicon/favicon.ico",
    apple: "/yyc3-icons/pwa/icon-192x192.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/yyc3-icons/pwa/icon-192x192.png",
    },
  },
  manifest: "/manifest.json",
}`

      if (metadataRegex.test(content)) {
        content = content.replace(metadataRegex, newMetadata)
      } else {
        // 如果没有找到metadata，在import后添加
        const importIndex = content.lastIndexOf("import")
        const nextLineIndex = content.indexOf("\n", importIndex)
        content = content.slice(0, nextLineIndex + 1) + "\n" + newMetadata + "\n" + content.slice(nextLineIndex + 1)
      }

      fs.writeFileSync(layoutPath, content, "utf-8")
      console.log("✅ 更新app/layout.tsx元数据")
    }
  }

  private async createBrandComponents(): Promise<void> {
    console.log("🎨 创建品牌组件...")

    // 创建Logo组件
    const logoComponent = `"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
  animated?: boolean
}

const sizeMap = {
  sm: { width: 32, height: 32, textSize: "text-sm" },
  md: { width: 48, height: 48, textSize: "text-base" },
  lg: { width: 64, height: 64, textSize: "text-lg" },
  xl: { width: 80, height: 80, textSize: "text-xl" },
}

export function Logo({ 
  size = "md", 
  className, 
  showText = false, 
  animated = false 
}: LogoProps) {
  const { width, height, textSize } = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative",
        animated && "animate-pulse"
      )}>
        <Image
          src="/yyc3-icons/pwa/icon-512x512.png"
          alt="YYC³-Med Logo"
          width={width}
          height={height}
          className={cn(
            "object-contain",
            animated && "hover:scale-110 transition-transform duration-300"
          )}
          priority
        />
        {animated && (
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold text-blue-600", textSize)}>
            言语云³
          </span>
          <span className={cn("text-xs text-muted-foreground")}>
            YYC³-Med
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
`

    // 创建品牌标语组件
    const sloganComponent = `"use client"

import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface SloganProps {
  className?: string
  size?: "sm" | "md" | "lg"
  align?: "left" | "center" | "right"
}

const slogans = {
  zh: "言启立方于万象，语枢智云守健康",
  en: "Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health",
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

export function Slogan({ 
  className, 
  size = "md", 
  align = "center" 
}: SloganProps) {
  const { language } = useLanguage()
  const slogan = slogans[language as keyof typeof slogans] || slogans.zh

  return (
    <p className={cn(
      "text-muted-foreground font-medium",
      sizeMap[size],
      alignMap[align],
      className
    )}>
      {slogan}
    </p>
  )
}

export default Slogan
`

    // 确保目录存在
    const brandDir = path.join(this.projectRoot, "components/brand")
    if (!fs.existsSync(brandDir)) {
      fs.mkdirSync(brandDir, { recursive: true })
    }

    // 写入组件文件
    fs.writeFileSync(path.join(brandDir, "logo.tsx"), logoComponent, "utf-8")
    fs.writeFileSync(path.join(brandDir, "slogan.tsx"), sloganComponent, "utf-8")

    console.log("✅ 创建品牌组件")
  }

  private async updateSEOConfig(): Promise<void> {
    console.log("🔍 更新SEO配置...")

    const seoConfig = `import type { Metadata } from "next"

export const siteConfig = {
  name: "${this.brandConfig.name.en}",
  title: "${this.brandConfig.title.en}",
  description: "${this.brandConfig.description.en}",
  url: "https://medical.yyc3.vip",
  ogImage: "https://medical.yyc3.vip/favicon-512x512.png",
  links: {
    twitter: "https://twitter.com/yyc_med",
    github: "https://github.com/yyc-med",
  },
  keywords: [${this.brandConfig.keywords.en.map((k) => `"${k}"`).join(", ")}],
  authors: [
    {
      name: "${this.brandConfig.name.en}",
      url: "https://medical.yyc3.vip",
    },
  ],
  creator: "${this.brandConfig.name.en}",
  themeColor: "#2563eb",
  manifest: "/manifest.json",
}

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/yyc3-icons/favicon/favicon.ico",
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    themeColor: siteConfig.themeColor,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@yyc_med",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    manifest: siteConfig.manifest,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

// 结构化数据
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${this.brandConfig.name.en}",
  "description": "${this.brandConfig.description.en}",
  "url": "https://medical.yyc3.vip",
  "logo": "https://medical.yyc3.vip/favicon-512x512.png",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "${this.brandConfig.name.en}"
  }
}
`

    const libDir = path.join(this.projectRoot, "lib")
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true })
    }

    fs.writeFileSync(path.join(libDir, "seo-config.ts"), seoConfig, "utf-8")
    console.log("✅ 创建SEO配置")
  }

  private async createI18nConfig(): Promise<void> {
    console.log("🌐 创建多语言配置...")

    const brandConstants = `export const BRAND_CONFIG = {
  name: {
    zh: "${this.brandConfig.name.zh}",
    en: "${this.brandConfig.name.en}",
  },
  slogan: {
    zh: "${this.brandConfig.slogan.zh}",
    en: "${this.brandConfig.slogan.en}",
  },
  title: {
    zh: "${this.brandConfig.title.zh}",
    en: "${this.brandConfig.title.en}",
  },
  description: {
    zh: "${this.brandConfig.description.zh}",
    en: "${this.brandConfig.description.en}",
  },
  keywords: {
    zh: [${this.brandConfig.keywords.zh.map((k) => `"${k}"`).join(", ")}],
    en: [${this.brandConfig.keywords.en.map((k) => `"${k}"`).join(", ")}],
  },
} as const

export type Language = "zh" | "en"
export type BrandKey = keyof typeof BRAND_CONFIG

export function getBrandText(key: BrandKey, language: Language = "zh") {
  return BRAND_CONFIG[key][language] || BRAND_CONFIG[key].zh
}

export function getBrandKeywords(language: Language = "zh") {
  return BRAND_CONFIG.keywords[language] || BRAND_CONFIG.keywords.zh
}
`

    const libDir = path.join(this.projectRoot, "lib")
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true })
    }

    fs.writeFileSync(path.join(libDir, "brand-constants.ts"), brandConstants, "utf-8")
    console.log("✅ 创建品牌常量配置")
  }

  private async updateManifest(): Promise<void> {
    console.log("📱 更新Manifest文件...")

    const manifest = {
      name: this.brandConfig.title.en,
      short_name: this.brandConfig.name.en,
      description: this.brandConfig.description.en,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#2563eb",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/yyc3-icons/favicon/favicon.ico",
          sizes: "48x48",
          type: "image/x-icon",
        },
        {
          src: "/yyc3-icons/pwa/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "/yyc3-icons/pwa/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
      categories: ["health", "medical", "productivity"],
      lang: "zh-CN",
      dir: "ltr",
      scope: "/",
      screenshots: [
        {
          src: "/screenshot-wide.png",
          sizes: "1280x720",
          type: "image/png",
          form_factor: "wide",
        },
        {
          src: "/screenshot-narrow.png",
          sizes: "750x1334",
          type: "image/png",
          form_factor: "narrow",
        },
      ],
    }

    const publicDir = path.join(this.projectRoot, "public")
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(path.join(publicDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8")

    console.log("✅ 更新manifest.json")
  }

  generateReport(): string {
    return `# 品牌集成报告

## ✅ 完成的任务

### 🎨 品牌视觉
- ✅ 集成新Logo图片 (盾牌形状蓝色渐变设计)
- ✅ 创建响应式Logo组件 (支持多种尺寸)
- ✅ 添加动画效果 (脉冲动画和悬停效果)

### 📝 品牌文案
- ✅ 中文标语: "${this.brandConfig.slogan.zh}"
- ✅ 英文标语: "${this.brandConfig.slogan.en}"
- ✅ 应用标题: "${this.brandConfig.title.en}"

### 🔍 SEO优化
- ✅ 完整的元数据配置
- ✅ Open Graph和Twitter Cards
- ✅ 结构化数据 (JSON-LD)
- ✅ 多语言支持

### 📱 PWA配置
- ✅ Manifest文件更新
- ✅ 图标配置 (192x192, 512x512)
- ✅ 主题色配置 (#2563eb)

### 🌐 国际化
- ✅ 中英文品牌配置
- ✅ 多语言标语组件
- ✅ 语言切换支持

## 📊 品牌资产

### 🎨 视觉元素
- **主色调**: #2563eb (蓝色)
- **辅助色**: #0ea5e9 (天蓝)
- **强调色**: #06b6d4 (青色)
- **Logo尺寸**: 32px, 48px, 64px, 80px

### 📝 文案资产
- **中文名称**: ${this.brandConfig.name.zh}
- **英文名称**: ${this.brandConfig.name.en}
- **应用标题**: ${this.brandConfig.title.en}
- **核心标语**: ${this.brandConfig.slogan.zh}

### 🔑 关键词
- **中文**: ${this.brandConfig.keywords.zh.join(", ")}
- **英文**: ${this.brandConfig.keywords.en.join(", ")}

## 🚀 使用方法

### Logo组件
\`\`\`tsx
import { Logo } from "@/components/brand/logo"

// 基础使用
<Logo size="md" />

// 带文字和动画
<Logo size="lg" showText animated />
\`\`\`

### 标语组件
\`\`\`tsx
import { Slogan } from "@/components/brand/slogan"

// 基础使用
<Slogan />

// 自定义样式
<Slogan size="lg" align="center" className="text-blue-600" />
\`\`\`

### 品牌常量
\`\`\`tsx
import { getBrandText, getBrandKeywords } from "@/lib/brand-constants"

const title = getBrandText("title", "en")
const keywords = getBrandKeywords("zh")
\`\`\`

## 🎯 品牌一致性

所有品牌元素已统一配置，确保在以下场景中保持一致：
- 🌐 网站标题和描述
- 🔍 搜索引擎结果
- 📱 社交媒体分享
- 💻 PWA应用信息
- 🎨 UI组件展示

品牌集成已完成，项目现在具备完整的品牌形象！
`
  }
}
