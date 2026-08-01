import type { OrgMark, TimelineEntry } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { asset } from '../lib/asset';
import { ChipList } from './Chip';

/**
 * One organisation mark on the same plate the certification cards use.
 *
 * Logos are masked rather than drawn: the source files are white-on-transparent
 * SVGs, so using them as a mask over `bg-primary` tints them with the token and
 * keeps them legible in both themes. It also keeps the Qassim file — 100 kB of
 * path data — out of the JS bundle, which inlining it would not.
 */
function Mark({ mark }: { mark: OrgMark }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:h-10 sm:w-14"
    >
      {mark.kind === 'monogram' ? (
        <span dir="ltr" className="font-mono text-xs font-semibold tracking-wider">
          {mark.label}
        </span>
      ) : (
        <span
          className={`bg-primary ${
            mark.shape === 'wide' ? 'h-4 w-10 sm:h-5 sm:w-12' : 'h-6 w-6 sm:h-7 sm:w-7'
          }`}
          style={{
            // Resolved against the deploy base — the paths in content.ts are
            // root-relative, and Vite does not rewrite literals inside JS.
            maskImage: `url(${asset(mark.src)})`,
            WebkitMaskImage: `url(${asset(mark.src)})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      )}
    </span>
  );
}

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

      {/* Marks stack rather than sit side by side, so a jointly run programme
          keeps the same column width as a single-org entry. */}
      {entry.marks && entry.marks.length > 0 && (
        <div className="flex shrink-0 flex-col gap-2">
          {entry.marks.map((mark) => (
            <Mark key={mark.kind === 'monogram' ? mark.label : mark.src} mark={mark} />
          ))}
        </div>
      )}

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
