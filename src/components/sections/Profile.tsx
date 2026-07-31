import { useLocale } from '../../i18n/LocaleProvider';
import { Section } from '../Section';

export function Profile() {
  const { t } = useLocale();

  return (
    <Section id="profile" index="01" title={t.sections.profile.title} kicker={t.sections.profile.kicker}>
      <p className="max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
        {t.profile.body}
      </p>
    </Section>
  );
}
