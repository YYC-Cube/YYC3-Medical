"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 支持的语言
export type Locale = "zh-CN" | "en-US" | "ja-JP" | "ko-KR"

// 语言名称映射
const localeNames: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
}

// 基本翻译数据
const translations: Record<Locale, Record<string, string>> = {
  "zh-CN": {
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.confirm": "确认",
    "common.delete": "删除",
    "common.edit": "编辑",
    "common.add": "添加",
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.sort": "排序",
    "common.more": "更多",
    "common.less": "收起",
    "common.next": "下一步",
    "common.previous": "上一步",
    "common.submit": "提交",
    "common.reset": "重置",
    "common.close": "关闭",
    "common.open": "打开",
    "common.yes": "是",
    "common.no": "否",
    "common.ok": "确定",
    "common.back": "返回",
    "common.home": "首页",
    "common.settings": "设置",
    "common.profile": "个人资料",
    "common.logout": "退出登录",
    "common.login": "登录",
    "common.register": "注册",
    "common.welcome": "欢迎",
    "common.hello": "你好",
    "common.goodbye": "再见",
    "common.thankyou": "谢谢",
    "common.sorry": "抱歉",
    "common.congratulations": "恭喜",
    "common.warning": "警告",
    "common.info": "信息",
    "common.help": "帮助",
    "common.about": "关于",
    "common.contact": "联系我们",
    "common.terms": "条款",
    "common.privacy": "隐私",
    "common.copyright": "版权",
    "common.all": "全部",
    "common.none": "无",
    "common.select": "选择",
    "common.clear": "清除",
    "common.apply": "应用",
    "common.download": "下载",
    "common.upload": "上传",
    "common.import": "导入",
    "common.export": "导出",
    "common.print": "打印",
    "common.share": "分享",
    "common.copy": "复制",
    "common.paste": "粘贴",
    "common.cut": "剪切",
    "common.undo": "撤销",
    "common.redo": "重做",
    "common.refresh": "刷新",
    "common.reload": "重新加载",
    "common.restart": "重新启动",
    "common.start": "开始",
    "common.stop": "停止",
    "common.pause": "暂停",
    "common.resume": "继续",
    "common.finish": "完成",
    "common.complete": "完成",
    "common.incomplete": "未完成",
    "common.pending": "待处理",
    "common.processing": "处理中",
  },
  "en-US": {
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.more": "More",
    "common.less": "Less",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.close": "Close",
    "common.open": "Open",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.back": "Back",
    "common.home": "Home",
  },
  "ja-JP": {
    "common.loading": "読み込み中...",
    "common.error": "エラー",
    "common.success": "成功",
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.confirm": "確認",
    "common.delete": "削除",
    "common.edit": "編集",
    "common.add": "追加",
  },
  "ko-KR": {
    "common.loading": "로딩 중...",
    "common.error": "오류",
    "common.success": "성공",
    "common.save": "저장",
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.delete": "삭제",
    "common.edit": "편집",
    "common.add": "추가",
  },
}

// 语言上下文类型
interface LanguageContextType {
  t: (key: string, fallback?: string) => string
  locale: Locale
  setLocale: (locale: Locale) => void
  availableLocales: Locale[]
  localeName: Record<Locale, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const availableLocales: Locale[] = ["zh-CN", "en-US", "ja-JP", "ko-KR"]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh-CN")

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && availableLocales.includes(savedLocale)) {
      setLocale(savedLocale)
    } else {
      // 尝试从浏览器语言设置获取
      const browserLocale = navigator.language

      if (browserLocale.startsWith("zh")) {
        setLocale("zh-CN")
      } else if (browserLocale.startsWith("ja")) {
        setLocale("ja-JP")
      } else if (browserLocale.startsWith("ko")) {
        setLocale("ko-KR")
      } else {
        setLocale("en-US") // 默认英语
      }
    }
  }, [])

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem("locale", locale)
    document.documentElement.lang = locale
  }, [locale])

  // 翻译函数
  const t = (key: string, fallback?: string): string => {
    // 尝试从当前语言获取翻译
    if (translations[locale] && translations[locale][key]) {
      return translations[locale][key]
    }

    // 如果当前语言没有翻译，尝试从英语获取
    if (locale !== "en-US" && translations["en-US"] && translations["en-US"][key]) {
      return translations["en-US"][key]
    }

    // 如果英语也没有，尝试从中文获取
    if (locale !== "zh-CN" && translations["zh-CN"] && translations["zh-CN"][key]) {
      return translations["zh-CN"][key]
    }

    // 如果都没有，返回回退值或键名
    return fallback || key
  }

  return (
    <LanguageContext.Provider
      value={{
        t,
        locale,
        setLocale,
        availableLocales,
        localeName: localeNames,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
