import { createFileRoute } from '@tanstack/react-router';

import {
  reelslaunchFaqs,
  ReelslaunchHomepage,
} from '@/blocks/reelslaunch-homepage';

const title = 'can chatgpt create videos - Yes, but... | reelslaunch';
const description =
  'Can ChatGPT create videos? Learn the limits, then make H3 Max Reels faster with native audio and automatic Instagram scheduling. Try reelslaunch now.';

function HomePage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'reelslaunch',
      url: 'https://reelsautopilot.ai/',
      description:
        'H3 Max powered AI video generation and automatic Instagram Reels publishing for faceless channels.',
      applicationCategory: 'MultimediaApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Pricing varies by plan; trial availability may apply.',
      },
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

  return (
    <>
      <ReelslaunchHomepage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
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
      { property: 'og:url', content: 'https://reelsautopilot.ai/' },
      { property: 'og:image', content: 'https://reelsautopilot.ai/logo.png' },
      { property: 'og:image:width', content: '1516' },
      { property: 'og:image:height', content: '1130' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://reelsautopilot.ai/logo.png' },
    ],
    links: [
      { rel: 'canonical', href: 'https://reelsautopilot.ai/' },
      { rel: 'icon', href: '/favicon.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/favicon.png' },
    ],
  }),
  component: HomePage,
});
