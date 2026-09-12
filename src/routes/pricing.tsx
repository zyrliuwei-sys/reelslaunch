import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { PricingPage } from '@/blocks/pricing-page';

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
  loader: () => {
    const locale = getLocale();
    return {
      title: m['landing.pricing.title']({}, { locale }),
      description: m['landing.pricing.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { title, description } = loaderData;
    return {
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
    };
  },
  component: PricingPage,
});
