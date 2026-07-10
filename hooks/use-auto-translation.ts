'use client';

import { useTranslation } from './use-translation';
import { useAutoTranslation } from '@/contexts/auto-translation-context';
import { useState } from 'react';
import type { SupportedLanguage } from '@/services/translation-service';

/**
 * 增强的翻译钩子，支持自动翻译缺失的内容。
 *
 * - `t` 为异步版本：未命中本地词典时，调用 auto-translation 服务。
 * - `tSync` 为同步版本：仅查本地词典，未命中时返回 fallback 或键名。
 */
export function useEnhancedTranslation() {
  const { t, tSync, locale, isTranslating: baseIsTranslating, ...rest } = useTranslation();
  const { translate, isEnabled } = useAutoTranslation();
  const [translationLoading, setTranslationLoading] = useState<Record<string, boolean>>({});

  // 异步翻译函数：未命中本地词典时尝试自动翻译
  const enhancedT = async (key: string, fallback?: string): Promise<string> => {
    // 先查本地同步词典
    const translation = tSync(key);

    if (translation !== key) {
      return translation;
    }

    // 本地未命中且有回退文本，使用 auto-translation
    if (fallback) {
      setTranslationLoading(prev => ({ ...prev, [key]: true }));

      try {
        const translatedFallback = await translate(fallback, locale as SupportedLanguage);
        return translatedFallback;
      } catch (error) {
        console.error(`翻译键 "${key}" 的回退文本失败:`, error);
        return fallback;
      } finally {
        setTranslationLoading(prev => ({ ...prev, [key]: false }));
      }
    }

    return key;
  };

  return {
    t: enhancedT,
    tSync,
    locale,
    isTranslating: baseIsTranslating || Object.values(translationLoading).some(Boolean),
    isAutoTranslateEnabled: isEnabled,
    ...rest,
  };
}
