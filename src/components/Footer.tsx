import { links } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule py-8">
      <div className="flex flex-col gap-3 font-mono text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span aria-hidden="true" className="select-none text-primary">
            {'// '}
          </span>
          {t.footer.builtWith}
        </p>

        <p dir="ltr" className="shrink-0">
          © {year} {links.githubHandle} · {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
