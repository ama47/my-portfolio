import { useLocale } from '../i18n/LocaleProvider';
import { isAppleDevice } from '../lib/platform';

interface PaletteButtonProps {
  onClick: () => void;
  /** Icon-sized variant for the mobile bar. */
  compact?: boolean;
}

export function PaletteButton({ onClick, compact = false }: PaletteButtonProps) {
  const { t } = useLocale();
  const shortcut = isAppleDevice() ? '⌘K' : 'Ctrl K';

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={t.palette.open}
        aria-label={t.palette.open}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rule bg-surface-alt text-ink-muted transition-colors hover:border-primary hover:text-primary"
      >
        <SearchIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.palette.open}
      className="group flex w-full items-center gap-2 rounded-md border border-rule bg-surface-alt px-2.5 py-1.5 text-start font-mono text-xs text-ink-muted transition-colors hover:border-primary hover:text-primary"
    >
      <SearchIcon />
      <span className="truncate">{t.palette.open}</span>
      <kbd
        dir="ltr"
        className="ms-auto shrink-0 rounded border border-rule bg-surface px-1.5 py-0.5 text-[10px] text-ink-muted"
      >
        {shortcut}
      </kbd>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
