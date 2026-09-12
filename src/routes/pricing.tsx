import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import { PricingPage } from '@/blocks/pricing-page';

const title = 'Pricing | MiniMax H3 Max video plans | reelslaunch';
const description =
  'MiniMax H3 Max video pricing: $0.35/sec at 480p, $0.56/sec at 768p, or monthly plans from $28. Compare all three plans here.';
const canonicalUrl = `${SITE_URL}/pricing`;
const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Pricing',
      item: canonicalUrl,
    },
  ],
};

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: `${SITE_URL}/logo.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${SITE_URL}/logo.png` },
      { 'script:ld+json': breadcrumbStructuredData },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }),
  component: PricingPage,
});
