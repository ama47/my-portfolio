import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { CV_FILENAME, CV_PATH } from '../config';
import { SECTION_IDS, links } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { useTheme } from '../theme/ThemeProvider';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { fuzzyScore } from '../lib/fuzzy';

type Group = 'navigate' | 'actions' | 'links';

interface Command {
  id: string;
  label: string;
  group: Group;
  /** Extra text the query is matched against but that is never displayed. */
  keywords?: string;
  hint?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const GROUP_ORDER: readonly Group[] = ['navigate', 'actions', 'links'];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { t, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { copy } = useCopyToClipboard();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Element that had focus before opening, so it can be handed back on close.
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(() => {
    const goTo = (id: string) => () => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move keyboard focus along with the viewport, without a visible outline.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };

    const navigate: Command[] = SECTION_IDS.map((id) => ({
      id: `goto-${id}`,
      group: 'navigate',
      label: t.nav[id],
      keywords: `${id} ${t.sections[id].title}`,
      run: goTo(id),
    }));

    const actions: Command[] = [
      {
        id: 'toggle-theme',
        group: 'actions',
        label: theme === 'dark' ? t.palette.commands.toggleThemeLight : t.palette.commands.toggleThemeDark,
        keywords: 'theme dark light مظهر',
        run: toggleTheme,
      },
      {
        id: 'switch-locale',
        group: 'actions',
        label: t.palette.commands.switchLocale,
        keywords: 'language locale arabic english عربي لغة',
        run: toggleLocale,
      },
      {
        id: 'download-cv',
        group: 'actions',
        label: t.palette.commands.downloadCv,
        keywords: 'cv resume pdf سيرة',
        run: () => {
          const anchor = document.createElement('a');
          anchor.href = CV_PATH;
          anchor.download = CV_FILENAME;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        },
      },
      {
        id: 'copy-email',
        group: 'actions',
        label: t.palette.commands.copyEmail,
        keywords: `email ${links.email} بريد`,
        hint: links.email,
        run: () => void copy(links.email),
      },
    ];

    const external: Command[] = [
      {
        id: 'open-github',
        group: 'links',
        label: t.palette.commands.openGithub,
        keywords: `github ${links.githubHandle}`,
        run: () => window.open(links.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-linkedin',
        group: 'links',
        label: t.palette.commands.openLinkedin,
        keywords: 'linkedin',
        run: () => window.open(links.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'send-email',
        group: 'links',
        label: t.palette.commands.sendEmail,
        keywords: `mail ${links.email}`,
        run: () => {
          window.location.href = `mailto:${links.email}`;
        },
      },
    ];

    return [...navigate, ...actions, ...external];
  }, [t, theme, toggleTheme, toggleLocale, copy]);

  const results = useMemo(() => {
    if (!query.trim()) return commands;

    return commands
      .map((command) => {
        const score = fuzzyScore(`${command.label} ${command.keywords ?? ''}`, query.trim());
        return score === null ? null : { command, score };
      })
      .filter((entry): entry is { command: Command; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.command);
  }, [commands, query]);

  // Grouped for display, but `results` order still drives keyboard selection.
  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      items: results.filter((command) => command.group === group),
    })).filter((entry) => entry.items.length > 0);
  }, [results]);

  useEffect(() => setSelected(0), [query, open]);

  // Open: remember focus, lock scroll, focus the input.
  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Wait a frame so the input exists and is laid out before focusing.
    const raf = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Keep the highlighted row visible while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector('[data-selected="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [selected, open]);

  const runCommand = useCallback(
    (command: Command | undefined) => {
      if (!command) return;
      onClose();
      // Let the dialog unmount and focus settle before the command acts,
      // otherwise the restore-focus cleanup fights scrollIntoView.
      requestAnimationFrame(() => command.run());
    },
    [onClose],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelected((prev) => (results.length === 0 ? 0 : (prev + 1) % results.length));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelected((prev) =>
          results.length === 0 ? 0 : (prev - 1 + results.length) % results.length,
        );
        break;
      case 'Home':
        event.preventDefault();
        setSelected(0);
        break;
      case 'End':
        event.preventDefault();
        setSelected(Math.max(results.length - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        runCommand(results[selected]);
        break;
      case 'Tab': {
        // Focus trap: the input is the only tab stop inside the dialog.
        event.preventDefault();
        inputRef.current?.focus();
        break;
      }
      default:
        break;
    }
  }

  if (!open) return null;

  const activeId = results[selected] ? `command-${results[selected].id}` : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-[12vh]">
      <button
        type="button"
        aria-label={t.ui.close}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.palette.open}
        onKeyDown={handleKeyDown}
        className="relative flex max-h-[70vh] w-full max-w-lg animate-scale-in flex-col overflow-hidden rounded-xl border border-rule bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-rule px-4">
          <span aria-hidden="true" className="select-none font-mono text-sm text-primary">
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.palette.placeholder}
            // See the opt-out rule in index.css — focus is already obvious here.
            data-focus-ring="none"
            className="w-full bg-transparent py-3.5 font-mono text-sm text-ink placeholder:text-ink-muted/60"
          />
        </div>

        <ul
          ref={listRef}
          id="command-list"
          role="listbox"
          aria-label={t.palette.open}
          className="flex-1 overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-sm text-ink-muted">
              {t.palette.empty}
            </li>
          )}

          {grouped.map(({ group, items }) => (
            // listbox > group > option keeps the headings announced as labels
            // rather than silently flattening them away.
            <li key={group} role="group" aria-labelledby={`command-group-${group}`}>
              <p
                id={`command-group-${group}`}
                className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted"
              >
                {t.palette.groups[group]}
              </p>

              <ul role="presentation">
                {items.map((command) => {
                  const index = results.indexOf(command);
                  const isSelected = index === selected;

                  return (
                    <li
                      key={command.id}
                      id={`command-${command.id}`}
                      role="option"
                      aria-selected={isSelected}
                      data-selected={isSelected}
                      onMouseMove={() => setSelected(index)}
                      onClick={() => runCommand(command)}
                      className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm ${
                        isSelected ? 'bg-primary text-surface' : 'text-ink'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`font-mono text-xs ${isSelected ? 'opacity-80' : 'text-primary'}`}
                      >
                        {'>'}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{command.label}</span>
                      {command.hint && (
                        <span
                          dir="ltr"
                          className={`shrink-0 truncate font-mono text-xs ${
                            isSelected ? 'opacity-80' : 'text-ink-muted'
                          }`}
                        >
                          {command.hint}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t border-rule px-4 py-2 font-mono text-[10px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Key>↑</Key>
            <Key>↓</Key>
            {t.palette.hintNavigate}
          </span>
          <span className="flex items-center gap-1.5">
            <Key>↵</Key>
            {t.palette.hintSelect}
          </span>
          <span className="flex items-center gap-1.5">
            <Key>esc</Key>
            {t.palette.hintClose}
          </span>
        </div>
      </div>
    </div>
  );
}

function Key({ children }: { children: string }) {
  return (
    <kbd dir="ltr" className="rounded border border-rule bg-surface-alt px-1 py-0.5">
      {children}
    </kbd>
  );
}
