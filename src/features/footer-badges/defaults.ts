import type { FooterBadge } from './types';

/** Keeps the existing launch badge visible until an admin saves a badge list. */
export const DEFAULT_FOOTER_BADGES: FooterBadge[] = [
  {
    href: 'https://fazier.com/launches/www.reelslaunch.com',
    src: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark',
    alt: 'Fazier badge',
    width: 250,
  },
];
