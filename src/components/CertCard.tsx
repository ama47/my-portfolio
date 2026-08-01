import type { Certification } from '../data/content';
import { useLocale } from '../i18n/LocaleProvider';
import { AwardIcon, AwsLogo, ExternalLinkIcon, W3SchoolsLogo } from './icons';

/**
 * Issuer marks are monochrome and inherit the plate's `text-primary`, so they
 * stay legible in both themes without a light tile behind them.
 */
function IssuerMark({ logo }: { logo: Certification['logo'] }) {
  if (logo === 'aws') return <AwsLogo className="h-5 w-auto" />;
  if (logo === 'w3schools') return <W3SchoolsLogo className="h-6 w-6" />;
  return <AwardIcon className="h-5 w-5" />;
}

export function CertCard({ cert }: { cert: Certification }) {
  const { t } = useLocale();

  return (
    <article className="flex gap-4 rounded-xl border border-rule bg-surface-alt/50 p-5">
      {/* Wide enough for the AWS wordmark; a square plate crops it to nothing. */}
      <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <IssuerMark logo={cert.logo} />
      </span>

      <div className="min-w-0">
        <h3 className="font-semibold leading-snug text-ink">{cert.name}</h3>
        <p className="mt-0.5 font-mono text-xs text-primary">{cert.issuer}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{cert.description}</p>

        {cert.url && (
          <a
            href={cert.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted transition-colors hover:text-primary"
          >
            <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
            {t.ui.verifyCredential}
          </a>
        )}
      </div>
    </article>
  );
}
