import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import { PRODUCT_SOCIAL_IMAGE_URL } from '@/lib/motion-control-seo';
import {
  CanChatGPTCreateVideosPage,
  chatgptFaqs,
} from '@/blocks/can-chatgpt-create-videos';

const title = 'can chatgpt create videos - Yes, but... | reelslaunch';
const description =
  'Can ChatGPT create videos? Learn the limits, then make H3 Max Reels faster with native audio and automatic Instagram scheduling. Try reelslaunch now.';
const canonicalUrl = `${SITE_URL}/can-chatgpt-create-videos`;

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: canonicalUrl,
    image: PRODUCT_SOCIAL_IMAGE_URL,
    publisher: { '@type': 'Organization', name: 'reelslaunch', url: SITE_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: chatgptFaqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
];

export const Route = createFileRoute('/can-chatgpt-create-videos')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: PRODUCT_SOCIAL_IMAGE_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: PRODUCT_SOCIAL_IMAGE_URL },
      { 'script:ld+json': structuredData },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }),
  component: CanChatGPTCreateVideosPage,
});
