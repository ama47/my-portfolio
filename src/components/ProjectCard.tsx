import type { Project } from '../data/content';
import { ChipList } from './Chip';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-rule bg-surface-alt/50 p-5 transition-colors hover:border-primary/50">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-ink">{project.name}</h3>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-xs text-ink-muted opacity-60 transition-opacity group-hover:opacity-100"
        >
          ./
        </span>
      </header>

      <p dir="ltr" className="mt-1 font-mono text-xs text-ink-muted">
        {project.period}
      </p>

      {project.outcome && (
        <p className="mt-3">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
            {project.outcome}
          </span>
        </p>
      )}

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{project.description}</p>

      <div className="mt-5 border-t border-rule pt-4">
        <ChipList items={project.tech} />
      </div>
    </article>
  );
}
