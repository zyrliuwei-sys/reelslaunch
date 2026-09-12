'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import {
  h3Max480SecondsEquivalent,
  h3MaxRetailPlans,
  h3MaxRetailRatePerSecond,
} from '@/lib/h3-max-retail-plans';
import { currentPathWithQuery } from '@/lib/redirect';
import { m } from '@/paraglide/messages.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';
import {
  PricingTable,
  type PricingGroup,
  type PricingPlan,
} from '@/components/pricing-table';

const ALL_PROVIDERS: PaymentProvider[] = [
  'stripe',
  'creem',
  'paypal',
  'alipay',
  'wechat',
];

type PricingPeriod = 'one-time' | 'monthly' | 'yearly';

export function Pricing({
  title,
  description,
  compact = false,
  headingLevel = 'h2',
  periods = ['monthly', 'yearly', 'one-time'],
}: {
  title?: string;
  description?: string;
  compact?: boolean;
  headingLevel?: 'h1' | 'h2';
  periods?: PricingPeriod[];
} = {}) {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: configsData } = usePublicConfig();
  const configs = configsData ?? {};
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null);
  const [loadingProvider, setLoadingProvider] =
    useState<PaymentProvider | null>(null);

  const enabledProviders = useMemo<PaymentProvider[]>(
    () => ALL_PROVIDERS.filter((p) => configs[`${p}_enabled`] === 'true'),
    [configs]
  );

  const includedOutput = (secondsAt768p: number) =>
    m['pricing.h3.included_output']({
      seconds480:
        h3Max480SecondsEquivalent(secondsAt768p).toLocaleString('en-US'),
      seconds768: secondsAt768p.toLocaleString('en-US'),
    });
  const billedAnnually = (price: string) =>
    m['landing.pricing.billed_annually']({ price });
  const essentialsFeatures = () => [
    m['pricing.h3.feature_text_to_video'](),
    m['pricing.h3.feature_image_to_video'](),
    m['pricing.h3.feature_native_audio'](),
    m['pricing.h3.feature_short_clips'](),
  ];
  const studioFeatures = () => [
    m['pricing.h3.feature_everything_start'](),
    m['pricing.h3.feature_long_clips'](),
    m['pricing.h3.feature_first_last_frame'](),
    m['pricing.h3.feature_768p'](),
  ];
  const productionFeatures = () => [
    m['pricing.h3.feature_everything_creator'](),
    m['pricing.h3.feature_story_continuity'](),
    m['pricing.h3.feature_all_aspects'](),
    m['pricing.h3.feature_high_volume'](),
  ];

  const groups: PricingGroup[] = [
    {
      key: 'monthly',
      label: m['landing.pricing.monthly'](),
      plans: [
        {
          id: 'essentials-monthly',
          name: m['landing.pricing.essentials'](),
          description: m['landing.pricing.essentials_desc'](),
          price: '$28',
          interval: 'mo',
          includedValue: includedOutput(
            h3MaxRetailPlans.essentials.monthly.credits
          ),
          features: essentialsFeatures(),
          productId: h3MaxRetailPlans.essentials.monthly.productId,
          priceInCents: h3MaxRetailPlans.essentials.monthly.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.essentials.monthly.credits,
          plan: { name: 'Start', interval: 'month', intervalCount: 1 },
        },
        {
          id: 'studio-monthly',
          name: m['landing.pricing.studio'](),
          description: m['landing.pricing.studio_desc'](),
          price: '$84',
          interval: 'mo',
          featured: true,
          badge: m['landing.pricing.popular'](),
          includedValue: includedOutput(
            h3MaxRetailPlans.studio.monthly.credits
          ),
          features: studioFeatures(),
          productId: h3MaxRetailPlans.studio.monthly.productId,
          priceInCents: h3MaxRetailPlans.studio.monthly.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.studio.monthly.credits,
          plan: { name: 'Creator', interval: 'month', intervalCount: 1 },
        },
        {
          id: 'production-monthly',
          name: m['landing.pricing.production'](),
          description: m['landing.pricing.production_desc'](),
          price: '$224',
          interval: 'mo',
          includedValue: includedOutput(
            h3MaxRetailPlans.production.monthly.credits
          ),
          features: productionFeatures(),
          productId: h3MaxRetailPlans.production.monthly.productId,
          priceInCents: h3MaxRetailPlans.production.monthly.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.production.monthly.credits,
          plan: { name: 'Studio', interval: 'month', intervalCount: 1 },
        },
      ],
    },
    {
      key: 'yearly',
      label: m['landing.pricing.yearly'](),
      plans: [
        {
          id: 'essentials-yearly',
          name: m['landing.pricing.essentials'](),
          description: m['landing.pricing.essentials_desc'](),
          price: '$28',
          interval: 'mo',
          billingNote: billedAnnually('$336'),
          checkoutPrice: '$336',
          includedValue: includedOutput(
            h3MaxRetailPlans.essentials.yearly.credits
          ),
          features: essentialsFeatures(),
          productId: h3MaxRetailPlans.essentials.yearly.productId,
          priceInCents: h3MaxRetailPlans.essentials.yearly.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.essentials.yearly.credits,
          plan: { name: 'Start', interval: 'year', intervalCount: 1 },
        },
        {
          id: 'studio-yearly',
          name: m['landing.pricing.studio'](),
          description: m['landing.pricing.studio_desc'](),
          price: '$84',
          interval: 'mo',
          billingNote: billedAnnually('$1,008'),
          checkoutPrice: '$1,008',
          featured: true,
          badge: m['landing.pricing.popular'](),
          includedValue: includedOutput(h3MaxRetailPlans.studio.yearly.credits),
          features: studioFeatures(),
          productId: h3MaxRetailPlans.studio.yearly.productId,
          priceInCents: h3MaxRetailPlans.studio.yearly.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.studio.yearly.credits,
          plan: { name: 'Creator', interval: 'year', intervalCount: 1 },
        },
        {
          id: 'production-yearly',
          name: m['landing.pricing.production'](),
          description: m['landing.pricing.production_desc'](),
          price: '$224',
          interval: 'mo',
          billingNote: billedAnnually('$2,688'),
          checkoutPrice: '$2,688',
          includedValue: includedOutput(
            h3MaxRetailPlans.production.yearly.credits
          ),
          features: productionFeatures(),
          productId: h3MaxRetailPlans.production.yearly.productId,
          priceInCents: h3MaxRetailPlans.production.yearly.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.production.yearly.credits,
          plan: { name: 'Studio', interval: 'year', intervalCount: 1 },
        },
      ],
    },
    {
      key: 'one-time',
      label: m['landing.pricing.one_time'](),
      plans: [
        {
          id: 'essentials-one-time',
          name: m['landing.pricing.essentials'](),
          description: m['landing.pricing.essentials_desc'](),
          price: '$19.60',
          includedValue: includedOutput(
            h3MaxRetailPlans.essentials.oneTime.credits
          ),
          features: essentialsFeatures(),
          productId: h3MaxRetailPlans.essentials.oneTime.productId,
          priceInCents: h3MaxRetailPlans.essentials.oneTime.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.essentials.oneTime.credits,
          buttonText: m['landing.pricing.buy_credits'](),
        },
        {
          id: 'studio-one-time',
          name: m['landing.pricing.studio'](),
          description: m['landing.pricing.studio_desc'](),
          price: '$50.40',
          includedValue: includedOutput(
            h3MaxRetailPlans.studio.oneTime.credits
          ),
          features: studioFeatures(),
          featured: true,
          badge: m['landing.pricing.best_value'](),
          productId: h3MaxRetailPlans.studio.oneTime.productId,
          priceInCents: h3MaxRetailPlans.studio.oneTime.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.studio.oneTime.credits,
          buttonText: m['landing.pricing.buy_credits'](),
        },
        {
          id: 'production-one-time',
          name: m['landing.pricing.production'](),
          description: m['landing.pricing.production_desc'](),
          price: '$126',
          includedValue: includedOutput(
            h3MaxRetailPlans.production.oneTime.credits
          ),
          features: productionFeatures(),
          productId: h3MaxRetailPlans.production.oneTime.productId,
          priceInCents: h3MaxRetailPlans.production.oneTime.priceInCents,
          currency: 'usd',
          credits: h3MaxRetailPlans.production.oneTime.credits,
          buttonText: m['landing.pricing.buy_credits'](),
        },
      ],
    },
  ];
  const visibleGroups = (['monthly', 'yearly', 'one-time'] as const).flatMap(
    (period) =>
      periods.includes(period) && (!compact || period === 'monthly')
        ? groups.filter((group) => group.key === period)
        : []
  );

  const checkoutMutation = useMutation({
    mutationFn: ({
      plan,
      provider,
    }: {
      plan: PricingPlan;
      provider: PaymentProvider;
    }) =>
      apiPost<{ checkout_url?: string }>('/api/payment/checkout', {
        product_id: plan.productId,
        product_name: plan.productName || plan.name,
        plan_name: plan.plan?.name || plan.name,
        price: plan.priceInCents,
        currency: plan.currency || 'usd',
        type: plan.plan ? 'subscription' : 'one-time',
        description: plan.name,
        plan: plan.plan,
        credits: plan.credits,
        credits_valid_days: plan.creditsValidDays,
        payment_provider: provider,
        // Come back to the page the user paid from.
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (!data?.checkout_url) {
        toast.error('Checkout failed');
        setLoadingProvider(null);
        return;
      }
      window.location.href = data.checkout_url;
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Checkout failed');
      setLoadingProvider(null);
    },
  });

  function startCheckout(plan: PricingPlan, provider: PaymentProvider) {
    setLoadingProvider(provider);
    checkoutMutation.mutate({ plan, provider });
  }

  async function handleCheckout(plan: PricingPlan) {
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(currentPathWithQuery('/pricing'));
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
      return;
    }

    const selectEnabled = configs.select_payment_enabled === 'true';
    const defaultProvider = (configs.default_payment_provider ||
      enabledProviders[0] ||
      'stripe') as PaymentProvider;

    if (selectEnabled && enabledProviders.length > 1) {
      setPendingPlan(plan);
      setModalOpen(true);
      return;
    }

    await startCheckout(plan, defaultProvider);
  }

  function handleProviderSelect(provider: PaymentProvider) {
    if (!pendingPlan) return;
    startCheckout(pendingPlan, provider);
  }

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-y border-white/10 bg-[#08090a] px-4 py-24 text-white sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(57,195,239,0.14),transparent_66%)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-20 text-center">
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
        {compact && (
          <p className="mx-auto -mt-10 mb-10 max-w-3xl text-center text-sm text-neutral-400">
            See the full plan comparison and per-second pricing on the{' '}
            <Link
              href="/pricing"
              className="text-cyan-200 underline underline-offset-4"
            >
              pricing page
            </Link>
            .
          </p>
        )}
        <div className="mx-auto mb-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-neutral-400">
              {m['pricing.h3.rate_480']()}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              ${(h3MaxRetailRatePerSecond['480p'] / 100).toFixed(2)}
              <span className="ml-1 text-sm font-normal text-neutral-400">
                / sec
              </span>
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              {m['pricing.h3.minimum_480']()}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.06] p-5">
            <p className="text-sm text-cyan-100/80">
              {m['pricing.h3.rate_768']()}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              ${(h3MaxRetailRatePerSecond['768p'] / 100).toFixed(2)}
              <span className="ml-1 text-sm font-normal text-neutral-400">
                / sec
              </span>
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              {m['pricing.h3.minimum_768']()}
            </p>
          </div>
        </div>
        <PricingTable
          groups={visibleGroups}
          onCheckout={handleCheckout}
          compact={compact}
        />
      </div>

      <PaymentProviderModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setPendingPlan(null);
            setLoadingProvider(null);
          }
        }}
        providers={enabledProviders.length ? enabledProviders : ['stripe']}
        loadingProvider={loadingProvider}
        onSelect={handleProviderSelect}
        planName={pendingPlan?.name}
        price={pendingPlan?.checkoutPrice || pendingPlan?.price}
      />
    </section>
  );
}
