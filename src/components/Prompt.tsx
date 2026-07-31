import type { ReactNode } from 'react';

/**
 * The console motif: a `$` sigil, a command, and an optional blinking caret.
 * Always LTR — a shell prompt reads left-to-right in any locale.
 */
export function Prompt({
  children,
  caret = false,
  className = '',
}: {
  children: ReactNode;
  caret?: boolean;
  className?: string;
}) {
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2 font-mono text-sm ${className}`}>
      <span aria-hidden="true" className="select-none text-primary">
        $
      </span>
      <span className="text-ink-muted">{children}</span>
      {caret && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-2 animate-blink bg-primary align-middle"
        />
      )}
    </span>
  );
}
