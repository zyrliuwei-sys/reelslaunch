import { useState, type ComponentType, type SVGProps } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';
import { Button, buttonVariants } from '@/components/ui/button';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type PricingFeature =
  | string
  | { icon?: IconComponent; label: string; tooltip?: string };

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: string;
  checkoutPrice?: string;
  billingNote?: string;
  includedValue?: string;
  originalPrice?: string;
  currency?: string;
  interval?: string;
  featured?: boolean;
  badge?: string;
  features: PricingFeature[];
  buttonText?: string;
  productId?: string;
  productName?: string;
  paymentProvider?: PaymentProvider;
  priceInCents?: number;
  credits?: number;
  creditsValidDays?: number;
  plan?: {
    name: string;
    interval: string;
    intervalCount: number;
  };
}

export interface PricingGroup {
  key: string;
  label: string;
  plans: PricingPlan[];
}

export function PricingTable({
  groups,
  onCheckout,
  compact = false,
  previewOnly = false,
  initialGroupKey,
}: {
  groups: PricingGroup[];
  onCheckout?: (plan: PricingPlan) => void;
  compact?: boolean;
  previewOnly?: boolean;
  initialGroupKey?: string;
}) {
  const [activeGroup, setActiveGroup] = useState(
    initialGroupKey || groups[0]?.key || ''
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] =
    useState<PaymentProvider | null>(null);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: publicConfigs } = usePublicConfig();
  const enabledProviders = (
    ['stripe', 'creem', 'paypal', 'alipay', 'wechat'] as const
  ).filter((provider) => publicConfigs?.[`${provider}_enabled`] === 'true');

  const currentGroup = groups.find((g) => g.key === activeGroup) || groups[0];

  const checkoutMutation = useMutation({
    mutationFn: ({
      plan,
      provider,
    }: {
      plan: PricingPlan;
      provider?: PaymentProvider;
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
        ...(provider ? { payment_provider: provider } : {}),
        // Come back to the page the user paid from.
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error('Checkout did not return a payment URL.');
      }
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => {
      setLoadingId(null);
      setLoadingProvider(null);
    },
  });

  function startCheckout(plan: PricingPlan, provider?: PaymentProvider) {
    setLoadingId(plan.id);
    setLoadingProvider(provider ?? null);
    checkoutMutation.mutate({ plan, provider });
  }

  function handleCheckout(plan: PricingPlan) {
    if (onCheckout) {
      onCheckout(plan);
      return;
    }

    if (!plan.productId || !plan.priceInCents) return;

    if (!session?.user) {
      router.push(
        `/sign-in?callbackUrl=${encodeURIComponent(currentPathWithQuery('/pricing'))}`
      );
      return;
    }

    if (
      publicConfigs?.select_payment_enabled === 'true' &&
      enabledProviders.length > 1
    ) {
      setSelectedPlan(plan);
      setProviderModalOpen(true);
      return;
    }

    const defaultProvider =
      plan.paymentProvider ??
      (enabledProviders.length === 1
        ? enabledProviders[0]
        : (publicConfigs?.default_payment_provider as
            | PaymentProvider
            | undefined));
    startCheckout(plan, defaultProvider);
  }

  return (
    <section
      aria-labelledby="subscription-plans-heading"
      className="space-y-10"
    >
      <h3 id="subscription-plans-heading" className="sr-only">
        {m['settings.billing.subscription']()}
      </h3>

      {groups.length > 1 && (
        <div className="flex justify-center">
          <div
            aria-label={m['settings.billing.interval']()}
            className="inline-flex min-h-12 items-center rounded-2xl border border-white/10 bg-white/[0.055] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            role="tablist"
          >
            {groups.map((group) => (
              <button
                aria-controls={`pricing-panel-${group.key}`}
                aria-selected={activeGroup === group.key}
                id={`pricing-tab-${group.key}`}
                key={group.key}
                onClick={() => setActiveGroup(group.key)}
                role="tab"
                type="button"
                className={cn(
                  'relative min-h-10 min-w-24 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150',
                  activeGroup === group.key
                    ? 'text-[#090a0b]'
                    : 'text-neutral-500 hover:text-white focus-visible:text-white'
                )}
              >
                {activeGroup === group.key && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-white"
                    layoutId="pricing-period-indicator"
                    transition={
                      reduceMotion
                        ? { duration: 0.15 }
                        : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                    }
                  />
                )}
                <span className="relative z-10">{group.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        aria-labelledby={`pricing-tab-${activeGroup}`}
        id={`pricing-panel-${activeGroup}`}
        role="tabpanel"
        className={cn(
          'mx-auto grid items-stretch gap-4 sm:gap-5',
          currentGroup?.plans.length === 2
            ? 'max-w-3xl sm:grid-cols-2'
            : currentGroup?.plans.length === 3
              ? 'max-w-5xl sm:grid-cols-2 lg:grid-cols-3'
              : 'max-w-6xl sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {currentGroup?.plans.map((plan, index) => {
          const panelTransition = reduceMotion
            ? { duration: 0.15 }
            : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

          return (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'group relative flex min-w-0 flex-col rounded-[26px] border border-white/[0.08] bg-[#151719] p-1 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-1 sm:p-2',
                plan.featured
                  ? 'border-cyan-200/40 bg-[#26383d] ring-1 ring-cyan-100/15'
                  : 'hover:border-white/20'
              )}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              key={`${activeGroup}-${plan.id}`}
              transition={{
                ...panelTransition,
                delay: reduceMotion ? 0 : index * 0.05,
              }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-[21px] border border-white/[0.07] bg-[#0f1112] p-5 sm:p-6">
                <div className="flex min-h-7 items-center justify-between gap-3">
                  {plan.name && (
                    <p className="text-base leading-7 font-semibold tracking-wide text-white">
                      {plan.name}
                    </p>
                  )}
                  {(!compact || previewOnly) && plan.badge && (
                    <span className="rounded-full border border-cyan-100/20 bg-cyan-200/10 px-3 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap text-cyan-100">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mt-8 min-h-[104px]">
                  <div className="flex items-end gap-1.5">
                    <motion.span
                      aria-live="polite"
                      animate={{ opacity: 1, y: 0 }}
                      className="font-serif text-5xl font-semibold tracking-[-0.04em] text-white tabular-nums sm:text-6xl"
                      initial={
                        reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
                      }
                      key={`${activeGroup}-${plan.id}-price`}
                      transition={panelTransition}
                    >
                      {plan.price}
                    </motion.span>
                    {plan.interval && (
                      <span className="mb-2 text-sm font-medium text-neutral-500">
                        {plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.originalPrice && (
                    <span className="mt-1 block text-sm text-neutral-500 tabular-nums line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                  {plan.billingNote && (
                    <p className="mt-2 text-xs font-medium text-neutral-500">
                      {plan.billingNote}
                    </p>
                  )}
                  {(!compact || previewOnly) && plan.includedValue ? (
                    <p className="mt-4 text-sm font-medium text-cyan-100">
                      {plan.includedValue}
                    </p>
                  ) : (!compact || previewOnly) &&
                    typeof plan.credits === 'number' ? (
                    <p className="mt-4 text-sm font-medium text-white">
                      <span className="tabular-nums">
                        {m['landing.pricing.credits_after_payment']({
                          credits: plan.credits.toLocaleString('en-US'),
                        })}
                      </span>
                    </p>
                  ) : null}
                </div>

                <p className="mt-3 min-h-10 text-sm leading-5 text-neutral-400">
                  {plan.description}
                </p>

                {compact && !previewOnly ? (
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({
                        variant: plan.featured ? 'default' : 'outline',
                      }),
                      'mt-7 h-11 w-full rounded-xl border text-sm font-semibold whitespace-nowrap !transition-[transform,background-color,border-color] duration-150 ease-out active:translate-y-px',
                      plan.featured
                        ? '!border-cyan-100 !bg-cyan-100 !text-[#0c1719] hover:!bg-white'
                        : 'border-white/15 bg-white/[0.035] text-white hover:bg-white/[0.1]'
                    )}
                  >
                    {m['common.pricing.get_started']()}
                  </Link>
                ) : (
                  <Button
                    className={cn(
                      'mt-7 h-11 w-full rounded-xl border text-sm font-semibold whitespace-nowrap !transition-[transform,background-color,border-color] duration-150 ease-out active:translate-y-px',
                      plan.featured
                        ? '!border-cyan-100 !bg-cyan-100 !text-[#0c1719] hover:!bg-white'
                        : 'border-white/15 bg-white/[0.035] text-white hover:bg-white/[0.1]'
                    )}
                    disabled={previewOnly || loadingId === plan.id}
                    onClick={() => handleCheckout(plan)}
                    type="button"
                    variant={plan.featured ? 'default' : 'outline'}
                  >
                    {previewOnly
                      ? m['pricing.h3.preview_only']()
                      : loadingId === plan.id
                        ? m['common.pricing.processing']()
                        : plan.buttonText || m['common.pricing.get_started']()}
                  </Button>
                )}

                {(!compact || previewOnly) && plan.includedValue && (
                  <div className="mt-7 border-y border-white/[0.08] py-4 text-sm font-medium text-cyan-100">
                    {plan.includedValue}
                  </div>
                )}

                {(!compact || previewOnly) && (
                  <ul className="mt-6 space-y-3 pt-1">
                    {plan.features.map((feature, featureIndex) => {
                      const label =
                        typeof feature === 'string' ? feature : feature.label;

                      return (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-x-3 text-sm leading-6"
                        >
                          <CircleCheck
                            aria-hidden="true"
                            className={cn(
                              'mt-0.5 size-4 shrink-0',
                              plan.featured
                                ? 'text-cyan-200'
                                : 'text-neutral-600'
                            )}
                          />
                          <span className="text-neutral-200">{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
      <PaymentProviderModal
        open={providerModalOpen}
        onOpenChange={(open) => {
          setProviderModalOpen(open);
          if (!open) setSelectedPlan(null);
        }}
        providers={enabledProviders as PaymentProvider[]}
        loadingProvider={loadingProvider}
        onSelect={(provider) => {
          if (!selectedPlan) return;
          setProviderModalOpen(false);
          startCheckout(selectedPlan, provider);
        }}
        planName={selectedPlan?.name}
        price={selectedPlan?.price}
      />
    </section>
  );
}
