import { useLocale } from '../../i18n/LocaleProvider';
import { Section } from '../Section';

export function Languages() {
  const { t } = useLocale();

  return (
    <Section
      id="languages"
      index="07"
      title={t.sections.languages.title}
      kicker={t.sections.languages.kicker}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {t.languages.map((language) => (
          <li
            key={language.name}
            className="flex items-center justify-between gap-4 rounded-xl border border-rule bg-surface-alt/50 p-5"
          >
            <div className="min-w-0">
              <p className="font-semibold text-ink">{language.name}</p>
              {/* Only shown once a level is filled in inside content.ts. */}
              {language.level && (
                <p className="mt-0.5 font-mono text-xs text-ink-muted">{language.level}</p>
              )}
            </div>
            <span className="shrink-0 font-mono text-sm text-primary">{language.endonym}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
