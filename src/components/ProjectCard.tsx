import type { Project } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { ChipList } from './Chip';
import { GithubIcon } from './icons';

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useLocale();

  return (
    <article className="flex h-full flex-col rounded-xl border border-rule bg-surface-alt/50 p-5 transition-colors hover:border-primary/50">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-ink">{project.name}</h3>
      </header>

      <p className="mt-1 font-mono text-xs text-ink-muted">
        <span dir="ltr">{project.period}</span>
      </p>

      {project.outcome && (
        <p className="mt-3">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
            {project.outcome}
          </span>
        </p>
      )}

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{project.description}</p>

      <div className="mt-5 space-y-3 border-t border-rule pt-4">
        <ChipList items={project.tech} />

        {project.repos && (
          <ul className="flex flex-col gap-1.5">
            {project.repos.map((repo) => (
              <li key={repo.url}>
                {/* The row flows with the locale so the icon sits at the
                    inline-start; only the repo slug is pinned to LTR. */}
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex max-w-full items-center gap-2 font-mono text-xs text-ink-muted transition-colors hover:text-primary"
                >
                  <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                  <span dir="ltr" className="truncate">
                    {repo.name}
                  </span>
                  <span className="sr-only">— {t.ui.sourceOnGithub}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
