import { i18n } from 'i18next';

import { Language } from '@enums/language.enum';

export interface LanguageData {
  key: Language;
  name: string;
}

export const SupportedLanguages: LanguageData[] = [
  { key: Language.UA, name: 'Українська' },
  { key: Language.EN, name: 'English' },
];

export const getCurrentLanguage = (i18next: i18n): LanguageData =>
  SupportedLanguages.find(({ key }) => i18next.language === key) || SupportedLanguages[0];
