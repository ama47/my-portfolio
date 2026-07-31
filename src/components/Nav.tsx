import { SECTION_IDS, type SectionId } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { ThemeToggle } from './ThemeToggle';
import { LocaleToggle } from './LocaleToggle';
import { PaletteButton } from './PaletteButton';

interface NavProps {
  active: string | undefined;
  onOpenPalette: () => void;
}

function sectionIndex(id: SectionId) {
  return String(SECTION_IDS.indexOf(id) + 1).padStart(2, '0');
}

/**
 * Desktop rail: a sticky file tree with the active section marked by a filled
 * node. The connecting line is a logical inline-start border, so it mirrors
 * itself under RTL without flipping any box-drawing glyphs.
 *
 * Must be rendered as a direct flex sibling of <main>.
 */
export function NavRail({ active, onOpenPalette }: NavProps) {
  const { t } = useLocale();

  return (
    <nav
      aria-label={t.ui.menu}
      className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col justify-between py-12 lg:flex"
    >
      <div>
        <p dir="ltr" className="mb-4 font-mono text-xs text-ink-muted">
          ~/abdulaziz
        </p>

        <ul className="space-y-0.5 border-s border-rule">
          {SECTION_IDS.map((id) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group flex items-center gap-2 rounded-e-md py-1.5 pe-2 ps-3 font-mono text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-ink-muted hover:bg-surface-alt hover:text-ink'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                      isActive ? 'bg-primary' : 'bg-rule group-hover:bg-ink-muted'
                    }`}
                  />
                  <span className="tabular-nums opacity-60">{sectionIndex(id)}</span>
                  <span className={isActive ? 'font-medium' : ''}>{t.nav[id]}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <PaletteButton onClick={onOpenPalette} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleToggle />
        </div>
      </div>
    </nav>
  );
}

/**
 * Mobile bar: the same links as a scrollable sticky header.
 * Rendered full-bleed above the layout row, never inside it.
 */
export function NavBar({ active, onOpenPalette }: NavProps) {
  const { t } = useLocale();

  return (
    <div className="sticky top-0 z-30 border-b border-rule bg-surface/90 backdrop-blur lg:hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-2 py-2">
          <span dir="ltr" className="shrink-0 font-mono text-xs text-primary">
            ~/abdulaziz
          </span>
          <div className="ms-auto flex shrink-0 items-center gap-1.5">
            <PaletteButton onClick={onOpenPalette} compact />
            <ThemeToggle />
            <LocaleToggle />
          </div>
        </div>

        <nav aria-label={t.ui.menu}>
          <ul className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECTION_IDS.map((id) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                      isActive ? 'bg-primary text-surface' : 'bg-surface-alt text-ink-muted'
                    }`}
                  >
                    {t.nav[id]}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
