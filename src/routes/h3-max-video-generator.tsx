import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import { PRODUCT_SOCIAL_IMAGE_URL } from '@/lib/motion-control-seo';
import { H3MaxVideoGeneratorPage } from '@/blocks/h3-max-video-generator';

const title = 'H3 Max Video Generator | reelslaunch';
const description =
  'Use the reelslaunch H3 Max video generator with MiniMax H3 Max for native-audio clips, six aspect ratios, 480p or 768p output, and Instagram Reels publishing.';
const canonicalUrl = `${SITE_URL}/h3-max-video-generator`;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'reelslaunch H3 Max video generator',
  url: canonicalUrl,
  description,
  image: PRODUCT_SOCIAL_IMAGE_URL,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  provider: { '@type': 'Organization', name: 'reelslaunch', url: SITE_URL },
};

export const Route = createFileRoute('/h3-max-video-generator')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: 'website' },
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
  component: H3MaxVideoGeneratorPage,
});
