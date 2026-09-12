import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/', label: 'H3 Max Pricing' },
    { href: '/text-to-video', label: 'Text to Video' },
    { href: '/pricing', label: m['landing.nav.pricing']() },
  ];

  return (
    <SiteHeader
      navLinks={navLinks}
      tone="cinema"
      primaryAction={{
        href: '/sign-in',
        label: 'Sign in',
      }}
    />
  );
}
