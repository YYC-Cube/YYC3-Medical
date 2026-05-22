import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { LoadingProvider } from "@/contexts/loading-context"
import { UserAvatarProvider } from "@/contexts/user-avatar-context"
import { AutoTranslationProvider } from "@/contexts/auto-translation-context"
import { AutomaticExecutionProvider } from "@/contexts/automatic-execution-context"
import { Toaster } from "@/components/ui/toaster"
import { jsonLd } from "@/lib/seo-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "YYC³-Med | AI-Powered Intelligent Medical System",
    template: "%s | YYC³-Med",
  },
  description:
    "AI-powered intelligent medical system providing diagnostic assistance, case analysis, and knowledge graph capabilities",
  keywords: [
    "Medical AI",
    "Smart Diagnosis",
    "Case Analysis",
    "Knowledge Graph",
    "Medical System",
    "Artificial Intelligence",
  ],
  authors: [{ name: "YYC³-Med" }],
  creator: "YYC³-Med",
  publisher: "YYC³-Med",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://medical.yyc3.vip"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://medical.yyc3.vip",
    title: "YYC³-Med | AI-Powered Intelligent Medical System",
    description:
      "AI-powered intelligent medical system providing diagnostic assistance, case analysis, and knowledge graph capabilities",
    siteName: "YYC³-Med",
    images: [
      {
        url: "/yyc3-icons/pwa/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "YYC³-Med Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YYC³-Med | AI-Powered Intelligent Medical System",
    description:
      "AI-powered intelligent medical system providing diagnostic assistance, case analysis, and knowledge graph capabilities",
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
    icon: [
      { url: "/yyc3-icons/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/yyc3-icons/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/yyc3-icons/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/yyc3-icons/favicon/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/yyc3-icons/favicon/favicon.ico",
    apple: [
      { url: "/yyc3-icons/pwa/icon-192x192.png", sizes: "192x192" },
      { url: "/yyc3-icons/ios/icon-1024.png", sizes: "1024x1024" },
    ],
    other: [
      { rel: "mask-icon", url: "/yyc3-icons/pwa/icon-512x512.png" },
    ],
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <LoadingProvider>
              <UserAvatarProvider>
                <AutoTranslationProvider>
                  <AutomaticExecutionProvider>
                    {children}
                    <Toaster />
                  </AutomaticExecutionProvider>
                </AutoTranslationProvider>
              </UserAvatarProvider>
            </LoadingProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
