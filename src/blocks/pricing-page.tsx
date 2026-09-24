import { ArrowLeft } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  PRICING_PAGE_DESCRIPTION,
  PRICING_PAGE_HEADING,
} from '@/lib/pricing-seo';
import { m } from '@/paraglide/messages.js';
import { Pricing } from '@/blocks/pricing';

export function PricingPage() {
  return (
    <main className="relative min-h-screen bg-[#08090a] text-white">
      <div className="absolute top-6 left-4 z-10 sm:top-8 sm:left-8">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {m['common.pages.back_to_home']()}
        </Link>
      </div>
      <Pricing
        title={PRICING_PAGE_HEADING}
        description={PRICING_PAGE_DESCRIPTION}
        headingLevel="h1"
        signupHref="/sign-up"
      />

      <section className="mx-auto max-w-5xl space-y-20 px-4 py-20 text-neutral-300 sm:px-6 sm:py-28">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            How credits work
          </h2>
          <p className="mt-5 max-w-3xl leading-8 text-neutral-400">
            One credit represents about one second of 768p output. Each
            generation is charged by output seconds, with the selected
            resolution changing the rate. The plan cards show an estimated
            output range so you can compare a one-time pack, monthly allowance,
            or annual commitment before checkout.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            480p vs 768p
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <h3 className="text-xl font-medium text-white">480p</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                A lower-cost option for testing motion, comparing prompts, and
                producing more seconds from the same credit balance.
              </p>
            </article>
            <article className="rounded-2xl border border-cyan-200/25 bg-cyan-200/[0.05] p-6">
              <h3 className="text-xl font-medium text-white">768p</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                The detailed option for texture, lighting, and close subjects
                when a clip is ready to move into a finished post.
              </p>
            </article>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Compare the three plans
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                'Start · $29',
                'A smaller credit balance for testing prompts and short clips.',
              ],
              [
                'Creator · $79',
                'More room for regular production, frame guidance, and 768p detail.',
              ],
              [
                'Studio · $149',
                'The largest balance for an ongoing faceless-channel queue and six-ratio output.',
              ],
            ].map(([name, description]) => (
              <article
                key={name}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
              >
                <h3 className="text-lg font-medium text-white">{name}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            FAQ
          </h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {[
              [
                'How many seconds do my credits buy?',
                'The exact total depends on resolution and duration. The plan cards estimate the seconds available at 480p and 768p, and the workspace shows the selected generation cost before submission.',
              ],
              [
                'Can I change plans later?',
                'Yes. You can choose a different plan when you need a different credit balance or billing period. Existing credits remain subject to the current account and plan terms shown at checkout.',
              ],
              [
                'What happens if I use more than my allowance?',
                'A generation is checked against the available credit balance before it is submitted. Add another credit pack or move to a larger plan when you need more output.',
              ],
              [
                'Is there an annual discount?',
                'Annual billing packages the yearly allowance into one payment and displays the effective monthly price on the plan selector. Review the current annual total before checkout.',
              ],
              [
                'What is the refund policy?',
                'Refund eligibility follows the terms shown at checkout and the site refund policy. Contact support with the order details before requesting a refund so the team can review the payment and unused balance.',
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="cursor-pointer text-base font-medium text-white marker:text-cyan-200">
                  {question}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-8 text-sm">
          <Link href="/" className="text-cyan-200 hover:text-white">
            Back to the AI Reels Generator homepage
          </Link>
          <Link
            href="/text-to-video"
            className="text-cyan-200 hover:text-white"
          >
            Open H3 Max text to video
          </Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-3 px-4 pb-12 text-sm text-neutral-400 sm:px-6">
        <Link href="/text-to-video" className="hover:text-white">
          H3 Max text to video workspace
        </Link>
        <Link href="/" className="hover:text-white">
          {m['common.pages.back_to_home']()}
        </Link>
      </footer>
    </main>
  );
}
