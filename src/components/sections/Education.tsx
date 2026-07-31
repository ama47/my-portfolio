import { useLocale } from '../../i18n/LocaleProvider';
import { Section } from '../Section';
import { Timeline } from '../TimelineItem';

export function Education() {
  const { t } = useLocale();

  return (
    <Section
      id="education"
      index="04"
      title={t.sections.education.title}
      kicker={t.sections.education.kicker}
    >
      <Timeline entries={t.education} />
    </Section>
  );
}
