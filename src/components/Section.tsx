import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import type { SectionId } from '../data/content';

interface SectionProps {
  id: SectionId;
  /** Two-digit index shown in the rule bar, e.g. "02". */
  index: string;
  title: string;
  children: ReactNode;
}

/**
 * Every section shares one header treatment:
 *
 *   ── 02 ─ EXPERIENCE ───────────────────────────
 *
 * These headers used to carry a shell command above the rule as well. Eight of
 * them down the page read as noise, so the console motif is now confined to the
 * hero, where it lands once.
 *
 * The negative scroll-margin cancels the section's own top padding, so jumping
 * to #id parks the heading at the top of the viewport rather than the empty
 * padding above it. The sticky mobile bar is handled separately, by
 * `scroll-padding-top` on <html>. Keep these numbers equal to the `py-*` ones
 * or the heading drifts down again.
 */
export function Section({ id, index, title, children }: SectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-heading`}
      className="reveal -scroll-mt-14 py-14 sm:-scroll-mt-20 sm:py-20"
    >
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="font-mono text-sm text-primary"
          >
            ──
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-sm font-medium tabular-nums text-primary"
          >
            {index}
          </span>
          <h2
            id={`${id}-heading`}
            className="font-mono text-lg font-bold uppercase tracking-[0.18em] text-ink sm:text-xl"
          >
            {title}
          </h2>
          {/* Fills the remaining width so the header reads as one rule. */}
          <span aria-hidden="true" className="h-px flex-1 bg-rule" />
        </div>
      </header>

      {children}
    </section>
  );
}
