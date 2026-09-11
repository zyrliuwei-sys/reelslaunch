import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: 'reelslaunch ai',
      links: [
        { label: 'AI video workspace', href: '/text-to-video' },
        {
          label: 'Support: zyrliuwei@gmail.com',
          href: 'mailto:zyrliuwei@gmail.com',
          external: true,
        },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  ];
  return (
    <SiteFooter
      tagline="Experience the latest AI video generation capabilities — see video, hear audio, read text, and reason across modalities."
      columns={columns}
      socials={[]}
      badges={[
        {
          href: 'https://fazier.com/launches/www.h3price.com',
          src: 'https://fazier.com/api/v1/public/badges/launch_badges.svg?badge_type=featured&theme=light',
          alt: 'Fazier badge',
          width: 250,
        },
        {
          href: 'https://tooldirs.com',
          src: 'https://tooldirs.com/badge/badge_dark.svg',
          alt: 'Featured on ToolDirs',
          width: 200,
          height: 54,
        },
        {
          href: 'https://shinylaunch.com/product/h3price',
          src: 'https://shinylaunch.com/assets/images/badge.png',
          alt: 'ShinyLaunch',
          height: 54,
        },
        {
          href: 'https://shinylaunch.com/product/uncensoredaieditor',
          src: 'https://shinylaunch.com/assets/images/badge-dark.png',
          alt: 'ShinyLaunch',
          height: 54,
        },
      ]}
    />
  );
}
