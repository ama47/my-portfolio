import type { Certification } from '../data/content';

export function CertCard({ cert }: { cert: Certification }) {
  return (
    <article className="flex gap-4 rounded-xl border border-rule bg-surface-alt/50 p-5">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="9" r="5" />
          <path d="m8.5 13.5-1 7.5 4.5-2.5 4.5 2.5-1-7.5" />
        </svg>
      </span>

      <div className="min-w-0">
        <h3 className="font-semibold leading-snug text-ink">{cert.name}</h3>
        <p className="mt-0.5 font-mono text-xs text-primary">{cert.issuer}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{cert.description}</p>
      </div>
    </article>
  );
}
