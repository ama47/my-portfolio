import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { content, type Content, type Locale } from '../data/content';

const STORAGE_KEY = 'portfolio-locale';

interface LocaleContextValue {
  locale: Locale;
  /** Copy for the active locale. */
  t: Content;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {
    /* storage unavailable — fall through to the default */
  }
  return 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // The inline script in index.html has already stamped lang/dir on <html>;
  // reading the same source here keeps React in sync with it on first paint.
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', locale);
    root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.title = content[locale].meta.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', content[locale].meta.description);

    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* nothing to do — the choice just won't survive a reload */
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((prev) => (prev === 'en' ? 'ar' : 'en')),
    [],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: content[locale],
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}
