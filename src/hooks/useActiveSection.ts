import { useEffect, useState } from 'react';

/**
 * Scroll-spy for the section rail.
 *
 * A section becomes active when it crosses a narrow band near the top third of
 * the viewport, which tracks reading position better than "is visible at all"
 * — several sections are on screen at once on a tall display.
 */
export function useActiveSection(ids: readonly string[], enabled = true): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Keep document order rather than the order events arrived in.
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));

    // The final section can be too short to ever reach the band, so pin it
    // once the page is scrolled to the bottom.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const last = ids[ids.length - 1];
        if (last) setActive(last);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids, enabled]);

  return active;
}
