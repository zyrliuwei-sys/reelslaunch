import { createFileRoute } from '@tanstack/react-router';

import { SITE_URL } from '@/config';
import { PRODUCT_SOCIAL_IMAGE_URL } from '@/lib/motion-control-seo';
import {
  PRICING_PAGE_DESCRIPTION,
  PRICING_PAGE_TITLE,
} from '@/lib/pricing-seo';
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
  head: () => {
    const title = PRICING_PAGE_TITLE;
    const description = PRICING_PAGE_DESCRIPTION;
    return {
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
        { 'script:ld+json': breadcrumbStructuredData },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    };
  },
  component: PricingPage,
});
