import { useSyncExternalStore } from 'react';

import type { AppLocale, Language, LocalizedText } from '@/models';
export { translateUiText } from './ui-copy';

export const DEFAULT_LANGUAGE: Language = 'en';
export const DEFAULT_LOCALE: AppLocale = 'en';
export const SECONDARY_LANGUAGE: Language = 'id';
export const SECONDARY_LOCALE: AppLocale = 'id-ID';

let appLanguage: Language = DEFAULT_LANGUAGE;
const listeners = new Set<() => void>();

export function getAppLanguage(): Language {
  return appLanguage;
}

export function getAppLocale(language: Language = getAppLanguage()): AppLocale {
  return language === SECONDARY_LANGUAGE ? SECONDARY_LOCALE : DEFAULT_LOCALE;
}

export function formatDateValue(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(getAppLocale(), options).format(
    typeof value === 'string' ? new Date(value) : value,
  );
}

export function formatNumberValue(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(getAppLocale(), options).format(value);
}

export function setAppLanguage(language: Language): void {
  if (language === appLanguage) return;
  appLanguage = language;
  listeners.forEach((listener) => listener());
}

export function subscribeToAppLanguage(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function localize(
  value: LocalizedText,
  language: Language = getAppLanguage(),
): string {
  return value[language];
}

export function useI18n() {
  const language = useSyncExternalStore(
    subscribeToAppLanguage,
    getAppLanguage,
    getAppLanguage,
  );
  const locale = getAppLocale(language);

  return {
    language,
    locale,
    priceLocale: language === SECONDARY_LANGUAGE ? 'id-ID' as const : 'en-ID' as const,
    setLanguage: setAppLanguage,
    localize: (value: LocalizedText) => localize(value, language),
    t: (english: string, indonesian: string) =>
      language === SECONDARY_LANGUAGE ? indonesian : english,
  };
}
