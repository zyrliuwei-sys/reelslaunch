import { createFileRoute } from '@tanstack/react-router';

import { baseLocale, localizeUrl } from '@/paraglide/runtime.js';

const STATIC_PATHS = [
  '/',
  '/pricing',
  '/text-to-video',
  '/privacy-policy',
  '/terms-of-service',
];

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: string;
  priority: number;
};

function urlFor(path: string): string {
  return localizeUrl(`https://reelsautopilot.ai${path || '/'}`, {
    locale: baseLocale,
  }).href;
}

function entryXml(e: Entry): string {
  return [
    '  <url>',
    `    <loc>${urlFor(e.path)}</loc>`,
    e.lastModified ? `    <lastmod>${e.lastModified}</lastmod>` : null,
    `    <changefreq>${e.changeFrequency}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = STATIC_PATHS.map((path) => ({
          path,
          changeFrequency: 'weekly',
          priority: path === '/' ? 1 : 0.8,
        }));

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(entryXml),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
