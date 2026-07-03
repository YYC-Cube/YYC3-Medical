"use client"

import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface SloganProps {
  className?: string
  size?: "sm" | "md" | "lg"
  align?: "left" | "center" | "right"
  variant?: "default" | "technical" | "patient"
}

const slogans: Record<string, Record<string, string>> = {
  "zh-CN": {
    default: "言启立方于万象，语枢智云守健康",
    technical: "言启千行代码，语枢万物智能",
    patient: "言启立方于万象，语枢智云守健康",
  },
  "en-US": {
    default: "Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health",
    technical: "Words Inspire Thousands of Code Lines, Language Pivots the Intelligence of All Things",
    patient: "Words Initiate Cube Amid Vast Scenarios, Language Serves as Core, Smart Cloud Guards Health",
  },
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

export function Slogan({ className, size = "md", align = "center", variant = "default" }: SloganProps) {
  const { locale } = useLanguage()
  const langSlogans = slogans[locale] || slogans["zh-CN"]
  const slogan = langSlogans[variant] || langSlogans.default

  return <p className={cn("text-muted-foreground font-medium", sizeMap[size], alignMap[align], className)}>{slogan}</p>
}

export default Slogan
