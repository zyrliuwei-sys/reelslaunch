import { DEFAULT_FOOTER_BADGES } from '@/features/footer-badges/defaults';
import { parseStoredFooterBadges } from '@/features/footer-badges/validation';

import { cn } from '@/lib/utils';
import { usePublicConfig } from '@/hooks/use-public-config';

export function FooterBadgeList({ className }: { className?: string }) {
  const { data } = usePublicConfig();
  const badges =
    data?.footer_badges === undefined
      ? DEFAULT_FOOTER_BADGES
      : parseStoredFooterBadges(data.footer_badges);

  if (badges.length === 0) return null;

  // Two identical copies make the -50% → 0 loop seamless; the second copy is
  // hidden from assistive tech and keyboard focus.
  const renderCopy = (copy: number) =>
    badges.map((badge) => (
      <a
        key={`${copy}:${badge.href}:${badge.src}`}
        href={badge.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={copy > 0 || undefined}
        tabIndex={copy > 0 ? -1 : undefined}
        className="inline-flex shrink-0 opacity-80 transition-opacity hover:opacity-100"
      >
        <img
          src={badge.src}
          alt={badge.alt}
          loading="lazy"
          className="h-7 w-auto max-w-none sm:h-8"
        />
      </a>
    ));

  return (
    <div
      className={cn(
        'overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className
      )}
    >
      <div className="footer-badge-marquee flex w-max items-center gap-4 pr-4">
        {renderCopy(0)}
        {renderCopy(1)}
      </div>
    </div>
  );
}
