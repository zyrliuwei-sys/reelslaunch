import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronDown,
  Code2,
  Mail,
  MessageCircleMore,
  Share2,
  Sparkles,
  UsersRound,
  WandSparkles,
} from 'lucide-react';

import { Link, useRouter } from '@/core/i18n/navigation';
import {
  FAL_H3_MAX_LANDING_URL,
  FAL_H3_MAX_MODEL_URL,
  FAL_H3_MODEL_URL,
  REGULAR,
} from '@/lib/pricing';
import { saveVideoComposerDraft } from '@/lib/video-composer-draft';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { Pricing } from '@/blocks/pricing';
import {
  ReelslaunchHeroComposer,
  type ReelslaunchHeroComposerLabels,
} from '@/components/reelslaunch/hero-composer';
import {
  RuixenBentoCards,
  type RuixenBentoCardItem,
} from '@/components/ruixen-bento-cards';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';

type ReferenceRecord = readonly [string, ...string[]];

function parseRecords(value: string): ReferenceRecord[] {
  return value
    .split('\n')
    .filter(Boolean)
    .map((record): ReferenceRecord => {
      const [first = '', ...rest] = record.split('||');
      return [first, ...rest];
    });
}

const composerLabels = (): ReelslaunchHeroComposerLabels => ({
  addReference: m['proactiv.hero.composer.add_reference'](),
  firstFrame: m['proactiv.hero.composer.first_frame'](),
  lastFrame: m['proactiv.hero.composer.last_frame'](),
  aspectRatio: m['proactiv.hero.composer.aspect_ratio'](),
  avatar: m['proactiv.hero.composer.avatar'](),
  duration: m['proactiv.hero.composer.duration'](),
  durationLoading: m['proactiv.hero.composer.duration_loading'](),
  durationPending: m['proactiv.hero.composer.duration_pending'](),
  durationUnavailable: m['proactiv.hero.composer.duration_unavailable'](),
  durationUnsupported: m['proactiv.hero.composer.duration_unsupported'](),
  generate: m['proactiv.hero.composer.generate'](),
  generated: m['proactiv.hero.composer.generated'](),
  image: m['proactiv.hero.composer.image'](),
  imageModel: m['proactiv.hero.composer.image_model'](),
  model: m['proactiv.hero.composer.model'](),
  placeholder: m['proactiv.hero.composer.placeholder'](),
  product: m['proactiv.hero.composer.product'](),
  removeAttachment: m['proactiv.hero.composer.remove_attachment'](),
  resolution: m['proactiv.hero.composer.resolution'](),
  textModel: m['proactiv.hero.composer.text_model'](),
  video: m['proactiv.hero.composer.video'](),
  videoModel: m['proactiv.hero.composer.video_model'](),
});

const featureIcons = [Share2, BarChart3, Bot, UsersRound, WandSparkles];
const toolIcons = [Mail, Share2, Code2, Bot];
const h3MaxVideoReel = [
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/hero-1984.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-scooter-spot.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-balloon-keyframes.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-character-sf.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-jazz-trio.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-metamorphosis.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/feature-vase-painting.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-tideflats.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-pixel-platformer.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-chef.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-claymation.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-espresso.mp4',
  'https://ir7z8qsacw4tk54b.public.blob.vercel-storage.com/minimax-h3-max/example-hummingbird.mp4',
] as const;
const toolVideos = [
  '/proactiv-reference/showcase-videos/fashion-editorial.mp4',
  '/proactiv-reference/showcase-videos/neon-city.mp4',
  '/proactiv-reference/showcase-videos/dragon-flight.mp4',
  '/proactiv-reference/showcase-videos/alpine-train.mp4',
];

export function ProactivReferenceLanding() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const testimonials = parseRecords(m['reference.testimonials.records']()).map(
    ([name, role, text], index) => ({
      name,
      role: role ?? '',
      text: text ?? '',
      href: [
        FAL_H3_MAX_MODEL_URL,
        FAL_H3_MAX_LANDING_URL,
        FAL_H3_MODEL_URL,
        FAL_H3_MODEL_URL,
      ][index],
    })
  );
  const features = parseRecords(m['reference.features.records']());
  const featureCards: RuixenBentoCardItem[] = features.map(
    ([title, description], index) => ({
      title,
      description: description ?? '',
      icon: featureIcons[index] ?? Sparkles,
    })
  );
  const tools = parseRecords(m['reference.tools.records']());
  const faqs = parseRecords(m['reference.faq.records']());

  return (
    <div className="proactiv-reference relative isolate overflow-hidden bg-[#08090a] text-white">
      <Header />
      <AmbientLight />
      <main>
        <section className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pt-24 pb-12 sm:px-8 md:pt-36 md:pb-20">
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src="/proactiv-reference/hero-background-minimax-h3.mp4"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-0 h-full w-screen max-w-none -translate-x-1/2 object-cover opacity-70 motion-reduce:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-full w-screen max-w-none -translate-x-1/2 bg-[linear-gradient(180deg,rgba(8,9,10,0.56)_0%,rgba(8,9,10,0.64)_30%,rgba(8,9,10,0.86)_74%,#08090a_100%)]"
          />
          <h1 className="proactiv-reference-heading relative z-20 max-w-6xl text-center text-4xl leading-[1.03] font-semibold tracking-[-0.055em] sm:text-6xl lg:text-8xl">
            {m['reference.hero.title']()}
          </h1>
          <p className="relative z-20 mt-6 max-w-3xl text-center text-base leading-7 text-neutral-300 sm:mt-8 sm:text-xl sm:leading-8">
            {m['reference.hero.description']()}
          </p>

          <div className="relative z-20 mt-12 w-full px-0 sm:mt-16 md:px-12">
            <div className="absolute -inset-x-10 -inset-y-16 -z-10 rounded-[4rem] bg-[radial-gradient(circle_at_50%_0%,rgba(57,195,239,0.18),transparent_53%)] blur-2xl" />
            <div className="proactiv-reference-console relative mx-auto max-w-3xl rounded-[28px] border-4 border-neutral-900 bg-[#161719] p-1.5 shadow-[0_9px_20px_rgba(0,0,0,0.4),0_37px_37px_rgba(0,0,0,0.32),0_84px_50px_rgba(0,0,0,0.2)] md:p-2">
              <div className="absolute top-0 left-[12%] h-px w-2/3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              <div className="rounded-[18px] border border-white/10 bg-[#0e1011] p-2 sm:p-3">
                <div id="proactiv-reference-composer" className="scroll-mt-24">
                  <ReelslaunchHeroComposer
                    enableFrameInputs
                    appearance="console"
                    allowVideoMode={false}
                    compactAction
                    compactHeight
                    labels={composerLabels()}
                    requireReferences={false}
                    onGenerate={(values) => {
                      saveVideoComposerDraft(values);
                      const { prompt } = values;
                      router.push(
                        `/text-to-video?prompt=${encodeURIComponent(prompt)}`
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 pt-16 sm:px-8 md:pt-24">
          <AmbientLight />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 md:flex-row md:items-start">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-[-0.045em] text-white md:text-4xl">
                {m['reference.cta.title']()}
              </h2>
              <p className="mt-7 text-base leading-7 text-neutral-400">
                {m['reference.cta.description']()}
              </p>
            </div>
            <Link
              href="/text-to-video"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-base font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {m['proactiv.hero.composer.open_editor']()}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative z-10 mx-auto mt-16 max-w-6xl overflow-hidden rounded-t-[28px] border-x border-t border-white/15 bg-[#141414] p-3 shadow-[0_-10px_70px_rgba(255,255,255,0.08)] sm:p-5">
            <H3MaxVideoReel />
          </div>
        </section>

        <section
          id="features"
          className="relative mx-auto max-w-5xl scroll-mt-20 px-5 pt-20 pb-8 sm:px-8 md:pt-32 md:pb-12"
        >
          <SectionIntro
            icon={<Sparkles className="size-5 text-cyan-300" />}
            title={m['reference.features.title']()}
            description={m['reference.features.description']()}
          />
          <RuixenBentoCards items={featureCards} className="mt-12" />
        </section>

        <section className="relative bg-[#08090a] pt-8 pb-8 md:pt-12 md:pb-10">
          <div className="px-5 sm:px-8">
            <SectionIntro
              title={m['reference.tools.title']()}
              description={m['reference.tools.description']()}
            />
          </div>
          <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
            {tools.map(([title, description], index) => (
              <article
                key={title}
                className={`group grid gap-8 border-t border-white/10 py-12 last:pb-0 lg:items-center lg:gap-20 lg:py-24 ${
                  index % 2 === 0
                    ? 'lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.85fr)]'
                    : 'lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.7fr)]'
                }`}
              >
                <div className={index % 2 === 0 ? 'lg:order-2' : undefined}>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_10px_rgba(255,255,255,0.08)]">
                    {(() => {
                      const Icon = toolIcons[index] ?? Bot;
                      return <Icon className="size-6 text-cyan-300" />;
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold tracking-[-0.04em] text-white lg:text-4xl">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-7 text-neutral-400">
                    {description}
                  </p>
                </div>
                <div
                  className={`relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-3 shadow-2xl ${
                    index % 2 === 0 ? 'lg:order-1' : ''
                  }`}
                >
                  <video
                    src={toolVideos[index]}
                    aria-label={title}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-[16/10] w-full rounded-lg object-cover opacity-85 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
                  />
                  <div className="absolute right-8 bottom-3 left-8 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden pt-8 pb-20 md:pt-10 md:pb-32">
          <AmbientLight />
          <SectionIntro
            icon={<WandSparkles className="size-5 text-cyan-300" />}
            title={m['reference.testimonials.title']()}
            description={m['reference.testimonials.description']()}
          />
          <div className="price-columns mx-auto mt-12 flex h-[620px] max-w-6xl justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] px-5 sm:px-8">
            <TestimonialsColumn testimonials={testimonials} duration={32} />
            <TestimonialsColumn
              testimonials={[
                ...testimonials.slice(1),
                ...testimonials.slice(0, 1),
              ]}
              duration={39}
              className="hidden md:block"
              decorative
            />
            <TestimonialsColumn
              testimonials={[
                ...testimonials.slice(2),
                ...testimonials.slice(0, 2),
              ]}
              duration={35}
              className="hidden lg:block"
              decorative
            />
          </div>
        </section>

        <section className="px-5 pt-16 pb-8 sm:px-8">
          <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-white/20 bg-[#101416]/95 p-7 sm:p-10">
            <p className="text-sm tracking-wide text-cyan-200">
              {m['h3.hero.rate']()}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-6">
              {Object.entries(REGULAR).map(([resolution, rate]) => (
                <div key={resolution}>
                  <h2 className="text-lg text-neutral-300">{resolution}</h2>
                  <p className="mt-2 text-4xl font-semibold sm:text-5xl">
                    ${rate.toFixed(2)}
                    <span className="text-base text-neutral-400"> / sec</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-neutral-400">
              {m['h3.hero.note']()}
            </p>
            <a
              href={FAL_H3_MAX_MODEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-cyan-200 underline"
            >
              {m['h3.hero.source']()}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/text-to-video"
                className="rounded-lg bg-cyan-200 px-5 py-3 font-semibold text-black"
              >
                {m['proactiv.hero.composer.open_editor']()} →
              </Link>
            </div>
          </div>
        </section>

        <Pricing />

        <section className="mx-auto max-w-7xl px-5 pt-4 pb-20 sm:px-8 md:pt-6 md:pb-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="proactiv-reference-heading text-center text-3xl font-medium tracking-[-0.04em] sm:text-5xl">
              {m['reference.faq.title']()}
            </h2>
            <div className="mt-14 grid gap-4">
              {faqs.map(([question, answer], index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={question}
                    className="overflow-hidden rounded-xl bg-neutral-900"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left text-base font-bold"
                    >
                      {question}
                      <ChevronDown
                        className={`size-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen ? (
                      <p className="px-5 pb-5 text-base leading-7 text-neutral-400">
                        {answer}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function H3MaxVideoReel() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
    >
      {h3MaxVideoReel.map((src, index) => (
        <H3MaxVideoClip key={src} src={src} index={index} />
      ))}
    </div>
  );
}

function H3MaxVideoClip({ src, index }: { src: string; index: number }) {
  const clipRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(index === 0);
  const isLead = index === 0;

  useEffect(() => {
    if (shouldLoad) return;

    const clip = clipRef.current;
    if (!clip || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '320px 0px' }
    );
    observer.observe(clip);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={clipRef}
      className={`group relative overflow-hidden rounded-lg bg-black ${
        isLead ? 'sm:col-span-2 lg:col-span-3' : ''
      }`}
    >
      {shouldLoad ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src={src}
          className={`w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100 ${
            isLead ? 'aspect-[16/7] sm:aspect-[16/6]' : 'aspect-[16/10]'
          }`}
        />
      ) : (
        <div
          className={
            isLead ? 'aspect-[16/7] sm:aspect-[16/6]' : 'aspect-[16/10]'
          }
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.04]" />
    </div>
  );
}

function AmbientLight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[800px] overflow-hidden"
    >
      <div className="absolute -top-[420px] -left-24 h-[1050px] w-[440px] -rotate-45 bg-[radial-gradient(ellipse,rgba(255,255,255,0.09),rgba(255,255,255,0.015)_45%,transparent_72%)]" />
      <div className="absolute -top-[400px] left-48 h-[920px] w-[260px] -rotate-45 bg-[radial-gradient(ellipse,rgba(255,255,255,0.05),transparent_72%)]" />
    </div>
  );
}

function SectionIntro({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative z-10 text-center">
      {icon && (
        <div className="mx-auto flex size-11 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[inset_0_1px_12px_rgba(255,255,255,0.08)]">
          {icon}
        </div>
      )}
      <h2
        className={`proactiv-reference-heading ${icon ? 'mt-5' : ''}text-3xl font-medium tracking-[-0.045em] sm:text-5xl`}
      >
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}
