import { m } from '@/paraglide/messages.js';
import {
  PricingTable,
  type PricingGroup,
  type PricingPlan,
} from '@/components/pricing-table';

// Preview basis: standard EvoLink top-up tiers are about 68 credits / USD.
// Convert CNY packages to credits at a fixed 6.71 CNY / USD reference rate.
const CREDITS_PER_USD = 68;
const CNY_PER_USD = 6.71;
const RETAIL_CREDITS_PER_SECOND = {
  '480p': 0.05 * 7 * CREDITS_PER_USD,
  '768p': 0.08 * 7 * CREDITS_PER_USD,
} as const;

function creditsForPriceYuan(priceYuan: number) {
  return Math.round((priceYuan / CNY_PER_USD) * CREDITS_PER_USD);
}

function outputSeconds(credits: number, resolution: '480p' | '768p') {
  return Math.floor(credits / RETAIL_CREDITS_PER_SECOND[resolution]);
}

function makePlan(params: {
  id: string;
  name: string;
  description: string;
  priceYuan: number;
  displayPrice?: string;
  billingNote?: string;
  checkoutPrice?: string;
  interval?: string;
  featured?: boolean;
  badge?: string;
}): PricingPlan {
  const credits = creditsForPriceYuan(params.priceYuan);
  return {
    id: params.id,
    name: params.name,
    description: params.description,
    price:
      params.displayPrice ?? `¥${params.priceYuan.toLocaleString('en-US')}`,
    ...(params.checkoutPrice ? { checkoutPrice: params.checkoutPrice } : {}),
    ...(params.billingNote ? { billingNote: params.billingNote } : {}),
    ...(params.interval ? { interval: params.interval } : {}),
    credits,
    includedValue: m['pricing.h3.package_value']({
      credits: credits.toLocaleString('en-US'),
      seconds768: outputSeconds(credits, '768p').toLocaleString('en-US'),
      seconds480: outputSeconds(credits, '480p').toLocaleString('en-US'),
    }),
    featured: params.featured,
    badge: params.badge,
    features: [
      m['pricing.h3.feature_text_to_video'](),
      m['pricing.h3.feature_first_last_frame'](),
      m['pricing.h3.feature_short_clips'](),
    ],
  };
}

const periods = [
  { id: 'one-time', interval: undefined, prices: [19, 49, 99] },
  { id: 'monthly', interval: 'month', prices: [29, 79, 149] },
  { id: 'yearly', interval: 'year', prices: [299, 799, 1_499] },
] as const;

function createPricingGroups(): PricingGroup[] {
  const tiers = [
    {
      id: 'start',
      name: m['landing.pricing.essentials'](),
      description: m['landing.pricing.essentials_desc'](),
    },
    {
      id: 'creator',
      name: m['landing.pricing.studio'](),
      description: m['landing.pricing.studio_desc'](),
    },
    {
      id: 'studio',
      name: m['landing.pricing.production'](),
      description: m['landing.pricing.production_desc'](),
    },
  ];

  return periods.map((period) => ({
    key: period.id,
    label:
      period.id === 'one-time'
        ? m['landing.pricing.one_time']()
        : period.id === 'monthly'
          ? m['landing.pricing.monthly']()
          : m['landing.pricing.yearly'](),
    plans: tiers.map((tier, index) =>
      makePlan({
        id: `${period.id}-${tier.id}-preview`,
        name: tier.name,
        description: tier.description,
        priceYuan: period.prices[index],
        ...(period.id === 'yearly'
          ? {
              displayPrice: `¥${Math.round(period.prices[index] / 12).toLocaleString('en-US')}`,
              billingNote: m['pricing.h3.annual_total']({
                total: `¥${period.prices[index].toLocaleString('en-US')}`,
              }),
              checkoutPrice: `¥${period.prices[index].toLocaleString('en-US')}`,
            }
          : {}),
        ...(period.interval
          ? {
              interval:
                period.interval === 'month'
                  ? m['pricing.h3.interval_month']()
                  : m['pricing.h3.interval_month'](),
            }
          : {}),
        ...(index === 1
          ? {
              featured: true,
              badge:
                period.id === 'yearly'
                  ? m['landing.pricing.best_value']()
                  : m['landing.pricing.popular'](),
            }
          : {}),
      })
    ),
  }));
}

export function Pricing({
  title,
  description,
  compact = false,
  headingLevel = 'h2',
}: {
  title?: string;
  description?: string;
  compact?: boolean;
  headingLevel?: 'h1' | 'h2';
  /** Kept for older call sites; the preview always presents all 3 billing periods. */
  periods?: ('one-time' | 'monthly' | 'yearly')[];
} = {}) {
  const groups = createPricingGroups();

  return (
    <section
      id="pricing"
      className={`relative overflow-hidden border-y border-white/10 bg-[#08090a] px-4 text-white ${compact ? 'py-16 sm:py-20' : 'py-24 sm:py-32'}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(57,195,239,0.14),transparent_66%)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          {headingLevel === 'h1' ? (
            <h1 className="font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl">
              {title ?? m['landing.pricing.title']()}
            </h1>
          ) : (
            <h2 className="font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl">
              {title ?? m['landing.pricing.title']()}
            </h2>
          )}
          <p className="mx-auto mt-5 max-w-2xl text-neutral-400">
            {description ?? m['landing.pricing.description']()}
          </p>
        </div>
        <PricingTable groups={groups} initialGroupKey="monthly" previewOnly />
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-neutral-500">
          {m['pricing.h3.pricing_basis']()}
        </p>
      </div>
    </section>
  );
}
