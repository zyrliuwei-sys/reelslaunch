import { TextHoverEffect } from '@/components/ui/text-hover-effect';

export function HomepageCreatorsNote() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-4 pb-8 sm:px-8 sm:pt-8 sm:pb-10">
      <div className="relative pt-8 sm:pt-12 md:pt-14">
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
            For creators
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl sm:leading-[1.08]">
            <TextHoverEffect text="Can ChatGPT Make Videos? What Creators Should Know" />
          </h2>
          <p className="mt-6 text-base leading-8 text-neutral-400 sm:text-lg">
            When people ask can ChatGPT make videos, they usually mean two
            different things: can it generate a clip, and can it operate a
            content channel? The first answer is yes with the right access. The
            second needs a focused workflow that handles short clips, native
            audio, a publishing queue, and Instagram Reels scheduling.
          </p>
        </div>
      </div>
    </section>
  );
}
