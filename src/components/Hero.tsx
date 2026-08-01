import { useEffect, useState, type ReactNode } from 'react';
import { CV_FILENAME, CV_PATH } from '../config';
import { links } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from './icons';
import { Prompt } from './Prompt';

function HeroLink({
  href,
  icon,
  external = false,
  children,
}: {
  href: string;
  icon: ReactNode;
  external?: boolean;
  children: ReactNode;
}) {
  const externalProps = external ? { target: '_blank', rel: 'noreferrer noopener' } : {};

  return (
    <a
      href={href}
      {...externalProps}
      className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-primary"
    >
      {icon}
      <span dir="ltr">{children}</span>
    </a>
  );
}

/** Types out `whoami` once on load. Skipped entirely for reduced motion. */
function useTypedCommand(command: string, enabled: boolean) {
  const [typed, setTyped] = useState(() => (enabled ? '' : command));

  useEffect(() => {
    if (!enabled) {
      setTyped(command);
      return;
    }
    setTyped('');
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setTyped(command.slice(0, index));
      if (index >= command.length) window.clearInterval(id);
    }, 85);
    return () => window.clearInterval(id);
  }, [command, enabled]);

  return typed;
}

export function Hero() {
  const { t } = useLocale();
  const reduceMotion = usePrefersReducedMotion();
  const typed = useTypedCommand(t.hero.greeting, !reduceMotion);

  return (
    <section id="top" aria-labelledby="hero-name" className="pb-4 pt-10 sm:pt-16">
      <div className="rounded-xl border border-rule bg-surface-alt/60 p-5 sm:p-8">
        {/* Window chrome — the console frame, purely decorative. */}
        <div aria-hidden="true" className="mb-6 flex items-center gap-2 border-b border-rule pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          <span dir="ltr" className="ms-2 font-mono text-xs text-ink-muted">
            abdulaziz@portfolio: ~
          </span>
        </div>

        <Prompt caret className="mb-6 block">
          {typed}
        </Prompt>

        <h1
          id="hero-name"
          className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-5xl"
        >
          {t.hero.name}
        </h1>

        <p className="mt-3 font-mono text-base text-primary sm:text-lg">
          <span aria-hidden="true" className="select-none opacity-60">
            {'> '}
          </span>
          {t.hero.role}
        </p>

        <p className="mt-1 font-mono text-sm text-ink-muted">
          <span aria-hidden="true" className="select-none opacity-60">
            {'> '}
          </span>
          {t.hero.location}
        </p>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {t.hero.tagline}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={CV_PATH}
            download={CV_FILENAME}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm text-surface transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">[</span>
            {t.hero.downloadCv}
            <span aria-hidden="true">]</span>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-rule px-4 py-2 font-mono text-sm text-ink transition-colors hover:border-primary hover:text-primary"
          >
            <span aria-hidden="true">[</span>
            {t.hero.contactCta}
            <span aria-hidden="true">]</span>
          </a>
        </div>

        {/* Icons sit at the inline-start of each link and the row flows with
            the locale; only the Latin value carries dir="ltr". */}
        <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-5 font-mono text-xs">
          <li>
            <HeroLink href={`mailto:${links.email}`} icon={<MailIcon className="h-3.5 w-3.5" />}>
              {links.email}
            </HeroLink>
          </li>
          <li>
            <HeroLink href={`tel:${links.phone}`} icon={<PhoneIcon className="h-3.5 w-3.5" />}>
              {links.phoneDisplay}
            </HeroLink>
          </li>
          <li>
            <HeroLink href={links.github} icon={<GithubIcon className="h-3.5 w-3.5" />} external>
              github/{links.githubHandle}
            </HeroLink>
          </li>
          <li>
            <HeroLink
              href={links.linkedin}
              icon={<LinkedinIcon className="h-3.5 w-3.5" />}
              external
            >
              linkedin/{links.linkedinHandle}
            </HeroLink>
          </li>
        </ul>
      </div>
    </section>
  );
}
