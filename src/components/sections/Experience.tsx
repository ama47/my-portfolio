import { useLocale } from '../../i18n/LocaleProvider';
import { Section } from '../Section';
import { Timeline } from '../TimelineItem';

export function Experience() {
  const { t } = useLocale();

  return (
    <Section
      id="experience"
      index="02"
      title={t.sections.experience.title}
      kicker={t.sections.experience.kicker}
    >
      <Timeline entries={t.experience} />
    </Section>
  );
}
