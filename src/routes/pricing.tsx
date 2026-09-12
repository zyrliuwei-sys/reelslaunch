import { createFileRoute } from '@tanstack/react-router';

import { PricingPage } from '@/blocks/pricing-page';

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title: 'Pricing | MiniMax H3 Max video plans | reelslaunch' },
      {
        name: 'description',
        content:
          'MiniMax H3 Max video pricing: $0.35/sec at 480p, $0.56/sec at 768p, or monthly plans from $28. Compare all three plans here.',
      },
    ],
  }),
  component: PricingPage,
});
