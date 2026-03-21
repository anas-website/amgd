import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { messages, locales } from './translations';
import { I18nContext } from './context';

const STORAGE_KEY = 'cc-locale';

/** @param {string} key */
function translateForLocale(locale, key, vars) {
  const row = messages[key];
  let str = row?.[locale] ?? row?.en ?? key;
  if (vars && typeof str === 'string') {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replaceAll(`{${k}}`, String(v));
    });
  }
  return str;
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && locales.includes(saved)) return saved;
    } catch {
      /* ignore */
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      const lang = navigator.language.slice(0, 2).toLowerCase();
      if (lang === 'ar' || lang === 'he') return lang;
    }
    return 'en';
  });

  const setLocale = useCallback((next) => {
    if (!locales.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const isRTL = locale === 'ar' || locale === 'he';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.lang = locale;
    root.dir = isRTL ? 'rtl' : 'ltr';
  }, [locale, isRTL]);

  const t = useCallback((key, vars) => translateForLocale(locale, key, vars), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, isRTL, locales }),
    [locale, setLocale, t, isRTL]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
