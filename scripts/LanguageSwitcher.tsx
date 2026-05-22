// ...existing content from 混淆产物/LanguageSwitcher.tsx...'use client';

import { useRouter } from 'next-intl/client';
import { usePathname, useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div>
      <button
        onClick={() => switchLocale('zh')}
        disabled={locale === 'zh'}
      >
        中文
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={locale === 'en'}
      >
        English
      </button>
    </div>
  );
}
