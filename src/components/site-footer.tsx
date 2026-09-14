import type { ComponentType, SVGProps } from 'react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { BrandWordmark } from '@/components/brand-wordmark';
import { FooterBadgeList } from '@/components/footer-badge-list';
import { LocaleSelector } from '@/components/locale-selector';

export interface FooterColumn {
  title: string;
  /** external: open in a new tab. Off-site (http) hrefs always open in a new tab. */
  links: { label: string; href: string; external?: boolean }[];
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) =>
  /^(https?:\/\/|mailto:|tel:)/.test(href);

export interface FooterSocial {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  label: string;
}

export interface FooterBadge {
  href: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function SiteFooter({
  tagline,
  columns,
  socials,
  badge,
  badges,
  copyright,
}: {
  tagline?: string;
  columns?: FooterColumn[];
  socials?: FooterSocial[];
  badge?: FooterBadge;
  badges?: FooterBadge[];
  copyright?: string;
}) {
  const year = new Date().getFullYear();
  const largeBrandName =
    envConfigs.app_name.trim().split(/\s+/).at(0) || envConfigs.app_name;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#0d0e10] text-neutral-100">
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 sm:px-10 sm:pt-16 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)] lg:items-start">
          {columns && columns.length > 0 ? (
            <div
              className={cn(
                'grid gap-x-8 gap-y-10 sm:gap-x-12',
                columns.length === 1
                  ? 'grid-cols-1'
                  : columns.length <= 3
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : columns.length === 4
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
              )}
            >
              {columns.map((col) => (
                <div key={col.title} className="space-y-5">
                  <p className="text-sm font-semibold text-neutral-100">
                    {col.title}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        {isExternalHref(link.href) ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-neutral-400 transition-colors hover:text-[#f5b65e]"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            className="text-sm text-neutral-400 transition-colors hover:text-[#f5b65e]"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          <div className="max-w-sm lg:justify-self-end">
            <BrandWordmark
              brand={envConfigs.app_name}
              className="text-xl text-[#f5b65e]"
            />
            {tagline ? (
              <p className="mt-5 text-sm leading-6 text-neutral-400">
                {tagline}
              </p>
            ) : null}
            {(badges ?? (badge ? [badge] : [])).map((badge) => (
              <a
                key={badge.href}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block transition-opacity hover:opacity-80"
              >
                <img
                  src={badge.src}
                  alt={badge.alt}
                  width={badge.width ?? 250}
                  height={badge.height}
                  className={
                    badge.height
                      ? 'h-auto max-w-full'
                      : 'h-auto w-[140px] sm:w-[180px]'
                  }
                  loading="lazy"
                />
              </a>
            ))}
            <FooterBadgeList className="mt-6" />
            {socials && socials.length > 0 ? (
              <div className="mt-6 flex items-center gap-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 transition-colors hover:text-[#f5b65e]"
                  >
                    <s.icon className="size-[18px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-neutral-500">
            {copyright ||
              `© ${year} ${envConfigs.app_name}. All rights reserved.`}
          </span>
          <LocaleSelector
            variant="pill"
            className="border-neutral-700 text-neutral-300 hover:bg-white/5 hover:text-[#f5b65e]"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto mt-8 -mb-[10%] flex max-w-[1400px] justify-center px-3 text-center font-black tracking-[-0.1em] text-[#17191c] select-none sm:-mb-[7%] sm:px-6"
      >
        <span className="text-[clamp(5rem,24vw,22rem)] leading-[0.72]">
          {largeBrandName}
        </span>
        <span className="absolute right-0 bottom-0 left-0 h-[42%] bg-linear-to-b from-transparent via-[#0d0e10]/75 to-[#0d0e10]" />
      </div>
    </footer>
  );
}
