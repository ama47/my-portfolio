import { useLocale } from '../../i18n/LocaleProvider';
import { Chip } from '../Chip';
import { Section } from '../Section';

export function Skills() {
  const { t } = useLocale();

  return (
    <Section id="skills" index="06" title={t.sections.skills.title} kicker={t.sections.skills.kicker}>
      <div className="grid gap-4 sm:grid-cols-2">
        {t.skills.map((group) => (
          <div key={group.label} className="rounded-xl border border-rule bg-surface-alt/50 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
              <span aria-hidden="true" className="text-primary">
                #
              </span>
              {group.label}
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
              <span dir="ltr" className="tabular-nums opacity-60">
                {group.items.length}
              </span>
            </h3>

            <ul className="flex flex-wrap gap-2" dir="ltr">
              {group.items.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
