'use client';

import { useLanguage } from '@/contexts/language-context';
import type { Locale } from '@/contexts/language-context';

export default function LanguageSwitcher() {
  const { locale, setLocale, availableLocales, localeName } = useLanguage();

  const switchLocale = (newLocale: string) => {
    if (availableLocales.includes(newLocale as Locale)) {
      setLocale(newLocale as Locale);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {availableLocales.map(loc => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={locale === loc}
          className="text-sm"
        >
          {localeName[loc]}
        </button>
      ))}
    </div>
  );
}
