import { useCallback, useEffect, useState } from 'react';
import { SECTION_IDS } from './data/content';
import { useLocale } from './i18n/LocaleProvider';
import { useActiveSection } from './hooks/useActiveSection';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { NavBar, NavRail } from './components/Nav';
import { Certifications } from './components/sections/Certifications';
import { Contact } from './components/sections/Contact';
import { Education } from './components/sections/Education';
import { Experience } from './components/sections/Experience';
import { Languages } from './components/sections/Languages';
import { Profile } from './components/sections/Profile';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';

export default function App() {
  const { t } = useLocale();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Texture sits behind everything and never intercepts a click. */}
      <div
        aria-hidden="true"
        className="grid-texture pointer-events-none fixed inset-0 -z-10 opacity-[0.35] dark:opacity-20"
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-surface"
      >
        {t.ui.skipToContent}
      </a>

      {/* Full-bleed so it spans the viewport rather than becoming a flex column. */}
      <NavBar active={activeSection} onOpenPalette={openPalette} />

      <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 sm:px-6 lg:px-8">
        <NavRail active={activeSection} onOpenPalette={openPalette} />

        <main id="main" className="min-w-0 flex-1">
          <Hero />
          <Profile />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Skills />
          <Languages />
          <Contact />
          <Footer />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
