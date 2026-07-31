import type { TimelineEntry } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { ChipList } from './Chip';

/**
 * One node on the commit-graph timeline. Shared by Experience and Education.
 * The current role gets a ringed node and a HEAD tag, the way `git log`
 * marks the tip of a branch.
 */
export function TimelineItem({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  const { t } = useLocale();

  return (
    <li className="relative flex gap-4 sm:gap-6">
      {/* Graph gutter: node + connecting line. */}
      <div aria-hidden="true" className="relative flex w-4 shrink-0 justify-center">
        <span
          className={`absolute top-1.5 h-3 w-3 rounded-full border-2 ${
            entry.current
              ? 'border-primary bg-primary ring-4 ring-primary/20'
              : 'border-rule bg-surface'
          }`}
        />
        {!isLast && <span className="absolute top-6 bottom-0 w-px bg-rule" />}
      </div>

      {/* The last entry needs no trailing gutter — no line continues past it. */}
      <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-10'}`}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold text-ink">{entry.title}</h3>
          {entry.current && (
            <span
              dir="ltr"
              className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary"
            >
              HEAD
            </span>
          )}
        </div>

        <p className="mt-0.5 font-mono text-sm text-primary">{entry.org}</p>

        <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-xs text-ink-muted">
          <span dir="ltr">{entry.period}</span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{entry.location}</span>
        </p>

        <ul className="mt-4 space-y-2">
          {entry.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span className="min-w-0">{bullet}</span>
            </li>
          ))}
        </ul>

        {entry.highlight && (
          <p className="mt-4 inline-flex items-baseline gap-2 rounded-md border border-rule bg-surface-alt px-3 py-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {entry.highlight.label}
            </span>
            <span dir="ltr" className="font-mono text-base font-bold text-primary">
              {entry.highlight.value}
            </span>
          </p>
        )}

        {entry.tech.length > 0 && (
          <div className="mt-4">
            <span className="sr-only">{t.sections.skills.title}</span>
            <ChipList items={entry.tech} />
          </div>
        )}
      </div>
    </li>
  );
}

export function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="ps-1">
      {entries.map((entry, index) => (
        <TimelineItem
          key={`${entry.org}-${entry.title}`}
          entry={entry}
          isLast={index === entries.length - 1}
        />
      ))}
    </ol>
  );
}
