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
