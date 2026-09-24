import { h3MaxRetailPlans } from '@/lib/h3-max-retail-plans';
import { m } from '@/paraglide/messages.js';
import {
  PricingTable,
  type PricingGroup,
  type PricingPlan,
} from '@/components/pricing-table';

const RETAIL_CREDITS_PER_SECOND = { '480p': 0.35, '768p': 0.56 } as const;

function outputSeconds(credits: number, resolution: '480p' | '768p') {
  return Math.floor((credits * 0.56) / RETAIL_CREDITS_PER_SECOND[resolution]);
}

function formatUsd(priceInCents: number) {
  return `$${Math.round(priceInCents / 100).toLocaleString('en-US')}`;
}

const tiers = [
  {
    key: 'essentials',
    name: m['landing.pricing.essentials'](),
    description: m['landing.pricing.essentials_desc'](),
  },
  {
    key: 'studio',
    name: m['landing.pricing.studio'](),
    description: m['landing.pricing.studio_desc'](),
  },
  {
    key: 'production',
    name: m['landing.pricing.production'](),
    description: m['landing.pricing.production_desc'](),
  },
] as const;

const periods = [
  { id: 'one-time', planKey: 'oneTime', interval: undefined },
  { id: 'monthly', planKey: 'monthly', interval: 'month' },
  { id: 'yearly', planKey: 'yearly', interval: 'year' },
] as const;

function featuresForTier(tierKey: (typeof tiers)[number]['key']) {
  switch (tierKey) {
    case 'essentials':
      return [
        m['pricing.h3.feature_text_to_video'](),
        m['pricing.h3.feature_short_clips'](),
        m['pricing.h3.feature_native_audio'](),
      ];
    case 'studio':
      return [
        m['pricing.h3.feature_everything_start'](),
        m['pricing.h3.feature_first_last_frame'](),
        m['pricing.h3.feature_768p'](),
      ];
    case 'production':
      return [
        m['pricing.h3.feature_everything_creator'](),
        m['pricing.h3.feature_story_continuity'](),
        m['pricing.h3.feature_all_aspects'](),
        m['pricing.h3.feature_high_volume'](),
      ];
  }
}

function makePlan(params: {
  tier: (typeof tiers)[number];
  period: (typeof periods)[number];
  featured: boolean;
}): PricingPlan {
  const retail = h3MaxRetailPlans[params.tier.key][params.period.planKey];
  const yearly = params.period.id === 'yearly';
  const recurring = params.period.interval !== undefined;
  const displayedPrice = yearly
    ? Math.round(retail.priceInCents / 12)
    : retail.priceInCents;
  const periodLabel =
    params.period.interval === 'month'
      ? m['pricing.h3.interval_month']()
      : params.period.interval === 'year'
        ? m['pricing.h3.interval_month']()
        : undefined;
  return {
    id: retail.productId,
    productId: retail.productId,
    productName: `H3 Max ${params.tier.name} ${yearly ? 'Annual' : params.period.id === 'monthly' ? 'Monthly' : 'Credit Pack'}`,
    name: params.tier.name,
    description: params.tier.description,
    price: formatUsd(displayedPrice),
    priceInCents: retail.priceInCents,
    currency: 'usd',
    ...(yearly
      ? {
          checkoutPrice: formatUsd(retail.priceInCents),
          billingNote: m['pricing.h3.annual_total']({
            total: formatUsd(retail.priceInCents),
          }),
        }
      : {}),
    ...(periodLabel ? { interval: periodLabel } : {}),
    credits: retail.credits,
    includedValue: m['pricing.h3.package_value']({
      credits: retail.credits.toLocaleString('en-US'),
      seconds768: outputSeconds(retail.credits, '768p').toLocaleString('en-US'),
      seconds480: outputSeconds(retail.credits, '480p').toLocaleString('en-US'),
    }),
    featured: params.featured,
    badge: params.featured
      ? yearly
        ? m['landing.pricing.best_value']()
        : m['landing.pricing.popular']()
      : undefined,
    features: featuresForTier(params.tier.key),
    ...(recurring
      ? {
          plan: {
            name: `H3 Max ${params.tier.name}`,
            interval: params.period.interval!,
            intervalCount: 1,
          },
        }
      : {}),
  };
}

function createPricingGroups(): PricingGroup[] {
  return periods.map((period) => ({
    key: period.id,
    label:
      period.id === 'one-time'
        ? m['landing.pricing.one_time']()
        : period.id === 'monthly'
          ? m['landing.pricing.monthly']()
          : m['landing.pricing.yearly'](),
    plans: tiers.map((tier, index) =>
      makePlan({ tier, period, featured: index === 1 })
    ),
  }));
}

export function Pricing({
  title,
  description,
  compact = false,
  headingLevel = 'h2',
  signupHref,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
  headingLevel?: 'h1' | 'h2';
  signupHref?: string;
  /** Kept for older call sites; the preview always presents all 3 billing periods. */
  periods?: ('one-time' | 'monthly' | 'yearly')[];
} = {}) {
  const groups = createPricingGroups();

  return (
    <section
      id="pricing"
      className={`relative overflow-hidden border-y border-white/10 bg-[#0d1b21] px-4 text-white ${compact ? 'py-16 sm:py-20' : 'py-24 sm:py-32'}`}
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
        <PricingTable
          groups={groups}
          initialGroupKey="monthly"
          signupHref={signupHref}
        />
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-neutral-500">
          {m['pricing.h3.pricing_basis']()}
        </p>
      </div>
    </section>
  );
}
