import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Prompt } from './Prompt';
import type { SectionId } from '../data/content';

interface SectionProps {
  id: SectionId;
  /** Two-digit index shown in the rule bar, e.g. "02". */
  index: string;
  title: string;
  kicker: string;
  children: ReactNode;
}

/**
 * Every section shares one header treatment:
 *
 *   $ git log --author="Abdulaziz"
 *   ── 02 ─ EXPERIENCE ───────────────────────────
 */
export function Section({ id, index, title, kicker, children }: SectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-heading`}
      className="reveal scroll-mt-24 py-14 sm:py-20"
    >
      <header className="mb-8">
        <Prompt className="mb-3 block">{kicker}</Prompt>

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
