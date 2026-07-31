import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  /** `solid` is for the one or two things worth emphasising per section. */
  variant?: 'outline' | 'solid';
}

export function Chip({ children, variant = 'outline' }: ChipProps) {
  const base =
    'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs leading-5 whitespace-nowrap';
  const styles =
    variant === 'solid'
      ? 'bg-primary text-surface'
      : 'border border-rule bg-surface-alt text-ink-muted';

  // dir sits on the chip, not the list: the label is a Latin technology name
  // and must read LTR, but the list itself has to flow and align with the
  // surrounding text, which is RTL in Arabic.
  return (
    <span dir="ltr" className={`${base} ${styles}`}>
      {children}
    </span>
  );
}

export function ChipList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
