import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import en, { type Translations } from './en';
import ar from './ar';

type Lang = 'en' | 'ar';

const TRANSLATIONS: Record<Lang, Translations> = { en, ar };
const STORAGE_KEY = 'esp-monitor-lang';

interface I18nContextValue {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  t: en,
  setLang: () => {},
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'ar' || stored === 'en') ? stored : 'en';
  });

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  const isRTL = lang === 'ar';

  // Apply dir + lang to <html> so the whole document flips
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL]);

  return (
    <I18nContext.Provider value={{ lang, t: TRANSLATIONS[lang], setLang, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
