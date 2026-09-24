import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import { PRODUCT_SOCIAL_IMAGE_URL } from '@/lib/motion-control-seo';
import {
  reelslaunchFaqs,
  ReelslaunchHomepage,
} from '@/blocks/reelslaunch-homepage';

const title =
  'AI Reels Generator - Make and Auto-Post H3 Max Clips | reelslaunch';
const description =
  'Generate short videos with H3 Max and auto-publish them to Instagram Reels. Choose aspect ratio, resolution and duration, then queue the clips. Free to explore.';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'reelslaunch',
    url: `${SITE_URL}/`,
    description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: [
      { '@type': 'Offer', price: '29', priceCurrency: 'USD', name: 'Start' },
      { '@type': 'Offer', price: '79', priceCurrency: 'USD', name: 'Creator' },
      { '@type': 'Offer', price: '149', priceCurrency: 'USD', name: 'Studio' },
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
      { property: 'og:image', content: PRODUCT_SOCIAL_IMAGE_URL },
      { property: 'og:image:width', content: '1516' },
      { property: 'og:image:height', content: '1130' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: PRODUCT_SOCIAL_IMAGE_URL },
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
