/**
 * H3 Max's published post-promotion API rates multiplied by the platform's
 * 7× retail multiplier. One credit represents one second of 768p output.
 * Plans are priced in USD; credit bundles were re-based from the former CNY
 * plans at 6.7083 CNY/USD (2026-09-11 reference rate), rounded to whole
 * credits to preserve the original bundles' purchasing power.
 */
export const H3_MAX_RETAIL_MULTIPLIER = 7;

export const h3MaxRetailRatePerSecond = {
  '480p': 35,
  '768p': 56,
} as const;

export type H3MaxRetailResolution = '480P' | '768P';

/**
 * Price a H3 Max task in the same credit unit used by the public plans:
 * one credit buys one second of normal-rate 768p output.  Credits are whole
 * numbers, so lower-cost 480p tasks round up rather than undercharging.
 */
export function h3MaxCreditsForSeconds(params: {
  duration: number;
  resolution: H3MaxRetailResolution;
}) {
  const seconds = Math.max(0, Math.floor(params.duration));
  const rateInCents =
    params.resolution === '480P'
      ? h3MaxRetailRatePerSecond['480p']
      : h3MaxRetailRatePerSecond['768p'];

  return Math.ceil((rateInCents * seconds) / h3MaxRetailRatePerSecond['768p']);
}

type H3MaxRetailPlan = {
  credits: number;
  /** USD cents. The published numeric price amounts are unchanged. */
  priceInCents: number;
  productId: string;
};

export const h3MaxRetailPlans = {
  essentials: {
    oneTime: {
      credits: 1_295,
      priceInCents: 1_900,
      productId: 'h3_max_start_one_time',
    },
    monthly: {
      credits: 1_972,
      priceInCents: 2_900,
      productId: 'h3_max_start_monthly',
    },
    yearly: {
      credits: 20_326,
      priceInCents: 29_900,
      productId: 'h3_max_start_yearly',
    },
  },
  studio: {
    oneTime: {
      credits: 3_334,
      priceInCents: 4_900,
      productId: 'h3_max_creator_one_time',
    },
    monthly: {
      credits: 5_367,
      priceInCents: 7_900,
      productId: 'h3_max_creator_monthly',
    },
    yearly: {
      credits: 54_317,
      priceInCents: 79_900,
      productId: 'h3_max_creator_yearly',
    },
  },
  production: {
    oneTime: {
      credits: 6_728,
      priceInCents: 9_900,
      productId: 'h3_max_studio_one_time',
    },
    monthly: {
      credits: 10_130,
      priceInCents: 14_900,
      productId: 'h3_max_studio_monthly',
    },
    yearly: {
      credits: 101_866,
      priceInCents: 149_900,
      productId: 'h3_max_studio_yearly',
    },
  },
} as const satisfies Record<
  string,
  Record<'monthly' | 'oneTime' | 'yearly', H3MaxRetailPlan>
>;

/** At 480p, the same spend produces 1.6× as many seconds as 768p. */
export function h3Max480SecondsEquivalent(secondsAt768p: number) {
  return Math.round(
    (secondsAt768p * h3MaxRetailRatePerSecond['768p']) /
      h3MaxRetailRatePerSecond['480p']
  );
}
