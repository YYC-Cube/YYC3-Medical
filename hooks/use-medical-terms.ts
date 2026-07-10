'use client';

import { useLanguage } from '@/contexts/language-context';
import { medicalTerms, type MedicalTermKey } from '@/i18n/medical-terms';

export function useMedicalTerms() {
  const { locale } = useLanguage();

  const mt = (key: MedicalTermKey): string => {
    // 如果当前语言有这个键，返回翻译
    const localeTerms = medicalTerms[locale];
    if (localeTerms && localeTerms[key]) {
      return localeTerms[key];
    }

    // 如果当前语言没有这个键，尝试使用英文
    if (locale !== 'en-US') {
      const enTerms = medicalTerms['en-US'];
      if (enTerms && enTerms[key]) {
        return enTerms[key];
      }
    }

    // 如果英文也没有，返回键名
    return key;
  };

  return { mt };
}
