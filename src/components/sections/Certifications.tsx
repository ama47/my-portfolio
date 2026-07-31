import { useLocale } from '../../i18n/LocaleProvider';
import { CertCard } from '../CertCard';
import { Section } from '../Section';

export function Certifications() {
  const { t } = useLocale();

  return (
    <Section
      id="certifications"
      index="05"
      title={t.sections.certifications.title}
      kicker={t.sections.certifications.kicker}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {t.certifications.map((cert) => (
          <CertCard key={cert.name} cert={cert} />
        ))}
      </div>
    </Section>
  );
}
