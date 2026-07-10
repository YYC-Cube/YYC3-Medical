'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// 支持的语言 — 10 语言（含 i18n-core 扩展）
export type Locale = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR' | 'ar' | 'de' | 'es' | 'fr' | 'pt-BR' | 'zh-TW';

// 语言名称映射
const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'ar': 'العربية',
  'de': 'Deutsch',
  'es': 'Español',
  'fr': 'Français',
  'pt-BR': 'Português (Brasil)',
  'zh-TW': '繁體中文',
};

import enUS from '@/lib/i18n/flat/en-US.json';
import jaJP from '@/lib/i18n/flat/ja-JP.json';
import koKR from '@/lib/i18n/flat/ko-KR.json';
import zhCN from '@/lib/i18n/flat/zh-CN.json';

// 翻译数据统一来源（从 lib/i18n/flat/*.json 加载）
// 扩展语言暂使用 en-US 作为 fallback，逐步翻译
const translations: Record<Locale, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'ar': enUS,
  'de': enUS,
  'es': enUS,
  'fr': enUS,
  'pt-BR': enUS,
  'zh-TW': zhCN,
};

// 语言上下文类型
interface LanguageContextType {
  t: (key: string, fallback?: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: Locale[];
  localeName: Record<Locale, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLocales: Locale[] = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'ar', 'de', 'es', 'fr', 'pt-BR', 'zh-TW'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh-CN');

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && availableLocales.includes(savedLocale)) {
      setLocale(savedLocale);
    } else {
      // 尝试从浏览器语言设置获取（支持 10 语言）
      const bl = navigator.language.toLowerCase();
      if (bl.startsWith('zh-tw') || bl.startsWith('zh-hk')) setLocale('zh-TW');
      else if (bl.startsWith('zh')) setLocale('zh-CN');
      else if (bl.startsWith('ja')) setLocale('ja-JP');
      else if (bl.startsWith('ko')) setLocale('ko-KR');
      else if (bl.startsWith('ar')) setLocale('ar');
      else if (bl.startsWith('de')) setLocale('de');
      else if (bl.startsWith('es')) setLocale('es');
      else if (bl.startsWith('fr')) setLocale('fr');
      else if (bl.startsWith('pt')) setLocale('pt-BR');
      else setLocale('en-US'); // 默认英语
    }
  }, []);

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  // 翻译函数
  const t = (key: string, fallback?: string): string => {
    // 尝试从当前语言获取翻译
    if (translations[locale] && translations[locale][key]) {
      return translations[locale][key];
    }

    // 如果当前语言没有翻译，尝试从英语获取
    if (locale !== 'en-US' && translations['en-US'] && translations['en-US'][key]) {
      return translations['en-US'][key];
    }

    // 如果英语也没有，尝试从中文获取
    if (locale !== 'zh-CN' && translations['zh-CN'] && translations['zh-CN'][key]) {
      return translations['zh-CN'][key];
    }

    // 如果都没有，返回回退值或键名
    return fallback || key;
  };

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
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
