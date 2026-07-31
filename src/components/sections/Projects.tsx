import { useLocale } from '../../i18n/LocaleProvider';
import { ProjectCard } from '../ProjectCard';
import { Section } from '../Section';

export function Projects() {
  const { t } = useLocale();

  return (
    <Section
      id="projects"
      index="03"
      title={t.sections.projects.title}
      kicker={t.sections.projects.kicker}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {t.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
