import { useLocale } from '../i18n/LocaleProvider';

export function LocaleToggle() {
  const { locale, toggleLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      title={t.ui.localeSwitch}
      aria-label={t.ui.localeSwitch}
      className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-rule bg-surface-alt px-2 font-mono text-xs text-ink-muted transition-colors hover:border-primary hover:text-primary"
    >
      {/* Both codes are always shown so the inactive one reads as the target. */}
      <span dir="ltr" className={locale === 'en' ? 'text-primary' : ''}>
        EN
      </span>
      <span aria-hidden="true" className="opacity-40">
        /
      </span>
      <span dir="ltr" className={locale === 'ar' ? 'text-primary' : ''}>
        AR
      </span>
    </button>
  );
}
