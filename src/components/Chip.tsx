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

  return <span className={`${base} ${styles}`}>{children}</span>;
}

export function ChipList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" dir="ltr">
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
