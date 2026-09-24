import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { SITE_URL } from '@/lib/h3-seo';

const STATIC_PAGES: { path: string; title: string; description: string }[] = [
  { path: '', title: 'Home', description: 'Landing page' },
  { path: '/pricing', title: 'Pricing', description: 'Pricing plans' },
  {
    path: '/text-to-video',
    title: 'H3 Max Text to Video Generator',
    description:
      'Prompt-to-video workspace with native audio and Reels workflow.',
  },
  {
    path: '/h3-max-video-generator',
    title: 'H3 Max Video Generator',
    description: 'MiniMax H3 Max overview for short clips and Instagram Reels.',
  },
  {
    path: '/can-chatgpt-create-videos',
    title: 'Can ChatGPT Create Videos?',
    description:
      'Guide to ChatGPT video prompting and the reelslaunch workflow.',
  },
];

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { app_name, app_description } = envConfigs;

        const lines: string[] = [
          `# ${app_name}`,
          '',
          `> ${app_description}`,
          '',
          '## Pages',
          '',
          ...STATIC_PAGES.map(
            (p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.description}`
          ),
        ];

        lines.push('');

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});
