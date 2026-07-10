/**
 * i18n 模块入口
 *
 * 整合 i18n-core 语言包（10 语言）与项目原有翻译系统
 */

// 10 语言数据（来自 i18n-core）
export { zh_CN } from './locales/zh-CN';
export { zh_TW } from './locales/zh-TW';
export { en } from './locales/en';
export { ja } from './locales/ja';
export { ko } from './locales/ko';
export { ar } from './locales/ar';
export { de } from './locales/de';
export { es } from './locales/es';
export { fr } from './locales/fr';
export { pt_BR } from './locales/pt-BR';

// 支持的语言列表
export const supportedLocales = [
  'zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR',
  'ar', 'de', 'es', 'fr', 'pt-BR',
] as const;

export type SupportedLocale = typeof supportedLocales[number];
