'use client';

import { useState } from 'react';
import { ArrowRight, ChevronDown, Menu, ShieldCheck, X } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { BrandWordmark } from '@/components/brand-wordmark';
import { SiteUserMenu } from '@/components/site-user-menu';
import { buttonVariants } from '@/components/ui/button';

export interface NavLink {
  href: string;
  label: string;
  /** Open in a new tab. Off-site (http) hrefs always open in a new tab. */
  external?: boolean;
  /** When present, the primary action renders as a dropdown of these entries. */
  links?: NavLink[];
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

/**
 * Primary action rendered as a dropdown (e.g. "Sign in" offering user vs
 * admin sign-in). Backdrop layer closes the menu on outside clicks.
 */
function PrimaryActionDropdown({
  action,
  buttonClass,
  onNavigate,
}: {
  action: NavLink & { links?: NavLink[] };
  buttonClass: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const links = action.links ?? [];
  return (
    <div className="relative">
      <button
        type="button"
        className={cn(buttonClass, 'gap-1.5')}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {action.label}
        <ChevronDown
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className={cn(
              'absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border py-1 shadow-lg',
              'border-white/[0.09] bg-[#17181a] text-[#f7f2e9]'
            )}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/[0.07] hover:text-[#f5b65e]"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {link.href.includes('admin') && (
                  <ShieldCheck className="size-4" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function SiteHeader({
  navLinks,
  tone = 'default',
  primaryAction,
}: {
  navLinks?: NavLink[];
  tone?: 'default' | 'cinema';
  primaryAction?: NavLink;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const isCinemaTone = tone === 'cinema';
  const navLinkClass = cn(
    'text-sm transition-colors',
    isCinemaTone
      ? 'text-[#b9b5ae] hover:text-[#f5b65e]'
      : 'text-muted-foreground hover:text-foreground'
  );
  const primaryActionClass = cn(
    buttonVariants(),
    isCinemaTone
      ? 'h-10 gap-1.5 rounded-full border border-[#f5b65e]/50 bg-[#e6a34c] px-4 font-semibold text-[#18120b] hover:bg-[#f5b65e]'
      : 'gap-1.5'
  );
  const mobileLinkClass = cn(
    'rounded-md px-3 py-2 text-sm transition-colors',
    isCinemaTone
      ? 'text-[#b9b5ae] hover:bg-white/[0.07] hover:text-[#f5b65e]'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
  );
  const action = primaryAction ?? {
    href: '/settings',
    label: m['common.nav.get_started'](),
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur-xl',
        isCinemaTone
          ? 'border-b border-white/[0.09] bg-[#101113]/88 text-[#f7f2e9] shadow-[0_12px_35px_rgba(0,0,0,0.24)]'
          : 'bg-background/80'
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <BrandWordmark
            brand={envConfigs.app_name}
            className={cn(
              'text-lg',
              isCinemaTone && 'text-xl text-[#f5b65e] sm:text-[1.35rem]'
            )}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks?.map((link) =>
            isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                className={navLinkClass}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <SiteUserMenu
              name={user.name || 'User'}
              email={user.email}
              image={user.image}
            />
          ) : action.links?.length ? (
            <PrimaryActionDropdown
              action={action}
              buttonClass={primaryActionClass}
            />
          ) : isExternalHref(action.href) ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryActionClass}
            >
              {action.label}
              <ArrowRight className="size-4" />
            </a>
          ) : (
            <Link href={action.href} className={primaryActionClass}>
              {action.label}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            'p-2 md:hidden',
            isCinemaTone && 'text-[#f7f2e9] hover:text-[#f5b65e]'
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            'border-t px-4 pt-2 pb-4 md:hidden',
            isCinemaTone ? 'border-white/[0.09] bg-[#101113]' : 'border-border'
          )}
        >
          <nav className="flex flex-col gap-2">
            {navLinks?.map((link) =>
              isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div
            className={cn(
              'mt-3 flex items-center gap-2 border-t pt-3',
              isCinemaTone ? 'border-white/[0.09]' : 'border-border'
            )}
          >
            <div className="flex-1" />
            {user ? (
              <SiteUserMenu
                name={user.name || 'User'}
                email={user.email}
                image={user.image}
              />
            ) : action.links?.length ? (
              <PrimaryActionDropdown
                action={action}
                buttonClass={primaryActionClass}
                onNavigate={() => setMobileOpen(false)}
              />
            ) : isExternalHref(action.href) ? (
              <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryActionClass}
                onClick={() => setMobileOpen(false)}
              >
                {action.label}
              </a>
            ) : (
              <Link
                href={action.href}
                className={primaryActionClass}
                onClick={() => setMobileOpen(false)}
              >
                {action.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
