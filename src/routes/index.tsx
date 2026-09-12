import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import {
  reelslaunchFaqs,
  ReelslaunchHomepage,
} from '@/blocks/reelslaunch-homepage';

const title = 'can chatgpt create videos - Yes, but... | reelslaunch';
const description =
  'Can ChatGPT create videos? Learn the limits, then make H3 Max Reels faster with native audio and automatic Instagram scheduling. Try reelslaunch now.';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'reelslaunch',
    url: `${SITE_URL}/`,
    description:
      'H3 Max powered AI video generation and automatic Instagram Reels publishing for faceless channels.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: [
      { '@type': 'Offer', price: '28', priceCurrency: 'USD', name: 'Start' },
      { '@type': 'Offer', price: '84', priceCurrency: 'USD', name: 'Creator' },
      { '@type': 'Offer', price: '224', priceCurrency: 'USD', name: 'Studio' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: reelslaunchFaqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
];

function HomePage() {
  return <ReelslaunchHomepage />;
}

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: `${SITE_URL}/` },
      { property: 'og:image', content: `${SITE_URL}/logo.png` },
      { property: 'og:image:width', content: '1516' },
      { property: 'og:image:height', content: '1130' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${SITE_URL}/logo.png` },
      { 'script:ld+json': structuredData },
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/` },
      { rel: 'icon', href: '/favicon.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/favicon.png' },
    ],
  }),
  component: HomePage,
});
