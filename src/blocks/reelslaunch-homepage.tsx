import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Layers3,
  Plus,
  Sparkles,
} from 'lucide-react';

import { Link, useRouter } from '@/core/i18n/navigation';
import { saveVideoComposerDraft } from '@/lib/video-composer-draft';
import { m } from '@/paraglide/messages.js';
import { Pricing } from '@/blocks/pricing';
import { FooterBadgeList } from '@/components/footer-badge-list';
import {
  ReelslaunchHeroComposer,
  type ReelslaunchHeroComposerLabels,
} from '@/components/reelslaunch/hero-composer';
import { ReelslaunchNav } from '@/components/reelslaunch/nav';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

const REEL_AUTOPILOT_NAME = 'reelslaunch';

type ToolGalleryItem = {
  title: string;
  description: string;
  poster: string;
  video: string;
  linkText?: string;
};

const composerLabels = (): ReelslaunchHeroComposerLabels => ({
  addReference: m['reelslaunch.hero.composer.add_reference'](),
  firstFrame: m['reelslaunch.hero.composer.first_frame'](),
  lastFrame: m['reelslaunch.hero.composer.last_frame'](),
  aspectRatio: m['reelslaunch.hero.composer.aspect_ratio'](),
  avatar: m['reelslaunch.hero.composer.avatar'](),
  duration: m['reelslaunch.hero.composer.duration'](),
  durationLoading: m['reelslaunch.hero.composer.duration_loading'](),
  durationPending: m['reelslaunch.hero.composer.duration_pending'](),
  durationUnavailable: m['reelslaunch.hero.composer.duration_unavailable'](),
  durationUnsupported: m['reelslaunch.hero.composer.duration_unsupported'](),
  generate: m['reelslaunch.hero.composer.open_editor'](),
  generated: m['reelslaunch.hero.composer.generated'](),
  image: m['reelslaunch.hero.composer.image'](),
  imageModel: m['reelslaunch.hero.composer.image_model'](),
  model: m['reelslaunch.hero.composer.model'](),
  placeholder: m['reelslaunch.hero.composer.placeholder'](),
  product: m['reelslaunch.hero.composer.product'](),
  removeAttachment: m['reelslaunch.hero.composer.remove_attachment'](),
  resolution: m['reelslaunch.hero.composer.resolution'](),
  textModel: m['reelslaunch.hero.composer.text_model'](),
  video: m['reelslaunch.hero.composer.video'](),
  videoModel: m['reelslaunch.hero.composer.video_model'](),
});

const features = [
  {
    icon: Sparkles,
    title: 'Write a prompt',
    body: 'Describe the subject, movement, setting, sound, and mood in one clear direction.',
  },
  {
    icon: Layers3,
    title: 'Choose aspect ratio and resolution',
    body: 'Pick one of six ratios and choose 480p or 768p before you submit the clip.',
  },
  {
    icon: Gauge,
    title: 'Queue and publish',
    body: 'Review the result, add it to your queue, and set a cadence for Instagram Reels.',
  },
];

const tools: ToolGalleryItem[] = [
  {
    title: 'H3 Max short clips',
    description:
      'Generate 3- or 5-second clips with fast-queue processing and clear per-second pricing.',
    poster: '/reelslaunch-showcase/gallery/golden-dog.jpg',
    video: '/reelslaunch-showcase/gallery/golden-dog.mp4',
    linkText: 'text to video workspace',
  },
  {
    title: 'Native audio',
    description:
      'Every finished clip comes with native audio, so there is no need to add a voice track in post.',
    poster: '/reelslaunch-showcase/gallery/blue-whale.jpg',
    video: '/reelslaunch-showcase/gallery/blue-whale.mp4',
    linkText: 'native audio video generator',
  },
  {
    title: 'Auto-publish to Instagram Reels',
    description:
      'Set a publishing schedule once and let the queue keep your Reels workflow moving.',
    poster: '/reelslaunch-showcase/gallery/vr-studio.jpg',
    video: '/reelslaunch-showcase/gallery/vr-studio.mp4',
    linkText: 'Instagram Reels scheduler',
  },
  {
    title: 'Batch generation',
    description:
      'Keep a faceless channel supplied with a steady queue of short-form videos.',
    poster: '/reelslaunch-showcase/gallery/neon-city.jpg',
    video: '/reelslaunch-showcase/gallery/neon-city.mp4',
    linkText: 'batch video generation',
  },
  {
    title: 'A wild idea, in motion',
    description:
      'Explore a sunlit wildlife scene made from a simple creative direction.',
    poster: '/reelslaunch-showcase/gallery/wildlife.jpg',
    video: '/reelslaunch-showcase/gallery/wildlife.mp4',
  },
  {
    title: 'A city with its own rhythm',
    description:
      'Try a neon-soaked city scene with movement from the first frame.',
    poster: '/reelslaunch-showcase/gallery/neon-runner.jpg',
    video: '/reelslaunch-showcase/gallery/neon-runner.mp4',
  },
  {
    title: 'A little beyond reality',
    description:
      'Build an atmospheric fantasy scene with a striking subject and setting.',
    poster: '/reelslaunch-showcase/gallery/fantasy-bird.jpg',
    video: '/reelslaunch-showcase/gallery/fantasy-bird.mp4',
  },
  {
    title: 'Make the ordinary cinematic',
    description:
      'Give a familiar object a futuristic setting and a fresh visual point of view.',
    poster: '/reelslaunch-showcase/gallery/futuristic-car.jpg',
    video: '/reelslaunch-showcase/gallery/futuristic-car.mp4',
  },
];

function GalleryVideoPreview({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (
      !video ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.55] }
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      aria-label={`${title} video example`}
      aria-hidden="true"
      muted
      loop
      playsInline
      preload="none"
      className="h-full w-full object-cover"
    />
  );
}

export const reelslaunchFaqs = [
  [
    'How do I use the reelslaunch AI Reels Generator?',
    'Write a prompt describing the shot, choose an aspect ratio, resolution, and duration, then submit the generation. reelslaunch returns a short MiniMax H3 Max clip with native audio that you can review before adding it to your publishing queue.',
  ],
  [
    'How are H3 Max clips charged by the second?',
    'Credits are calculated from output seconds and the selected resolution. A 768p second uses the standard rate, while 480p costs fewer credits, so the same balance can produce more seconds at 480p. The workspace shows the estimate before you submit.',
  ],
  [
    'Can reelslaunch publish directly to Instagram Reels?',
    'Yes. Connect the Instagram workflow, review an approved clip, and add it to a publishing queue with your preferred cadence. The queue keeps generation and planned Reels publishing together so you do not have to move every finished clip manually.',
  ],
  [
    'Which aspect ratios and resolutions are supported?',
    'The generator supports six aspect ratios for vertical Reels, square posts, and wider placements. Choose 480p for efficient ideation or 768p when extra detail matters; the selected resolution and duration determine the credit estimate.',
  ],
  [
    'How long can generated clips be?',
    'MiniMax H3 Max clips are available from 5 to 15 seconds. Shorter clips are useful for testing a prompt and motion; longer clips give a scene more time to read before you queue it for publishing.',
  ],
  [
    'Is there a free allowance to explore reelslaunch?',
    'You can open the workspace and explore the prompt, framing, and generation settings without a credit card. Generation uses the current credit balance and per-second rates, so check the live plan details before submitting a paid clip.',
  ],
] as const;

export function ReelslaunchHomepage() {
  const router = useRouter();
  const [ctaHovered, setCtaHovered] = useState(false);
  const galleryRef = useRef<HTMLUListElement>(null);

  const moveGallery = (direction: -1 | 1) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const card = gallery.querySelector('li');
    gallery.scrollBy({
      left: direction * ((card?.getBoundingClientRect().width ?? 420) + 24),
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative isolate overflow-hidden bg-[#08090a] text-white">
      <ReelslaunchNav
        brand={REEL_AUTOPILOT_NAME}
        links={[
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Video workspace', href: '/text-to-video' },
          { label: 'Pricing plans', href: '/pricing' },
        ]}
        loginLabel="Sign in"
      />

      <main>
        <section className="relative mx-auto flex min-h-[900px] max-w-7xl flex-col items-center px-5 pt-36 pb-24 sm:px-8 md:pt-48">
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/reelslaunch-hero-h3max-poster.jpg"
            src="/reelslaunch-hero-h3max.mp4"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-0 h-full w-screen max-w-none -translate-x-1/2 object-cover object-center opacity-100 motion-reduce:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] h-full w-screen max-w-none -translate-x-1/2 bg-[linear-gradient(180deg,rgba(8,9,10,0.28)_0%,rgba(8,9,10,0.38)_42%,rgba(8,9,10,0.88)_100%)]"
          />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(57,195,239,0.2),transparent_35%),radial-gradient(circle_at_15%_45%,rgba(53,83,255,0.14),transparent_26%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[linear-gradient(180deg,rgba(8,9,10,0.25),#08090a)]" />
          <h1 className="relative z-10 mt-7 max-w-6xl text-center text-5xl leading-[0.98] font-semibold tracking-[-0.065em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] sm:text-7xl lg:text-[7.4rem]">
            AI Reels Generator for Faceless Instagram Channels
          </h1>
          <p className="relative z-10 mt-7 max-w-2xl text-center text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            reelslaunch is an ai reels generator that turns a prompt into a
            native-audio MiniMax H3 Max clip, then helps you queue and
            auto-publish it to Instagram Reels.
          </p>
          <p className="relative z-10 mt-5 text-center text-xs text-neutral-500">
            By the reelslaunch team · Last updated September 11, 2026
          </p>

          <div
            id="workflow"
            className="relative z-10 mt-14 w-full max-w-4xl scroll-mt-28"
          >
            <div className="absolute -inset-16 -z-10 rounded-[5rem] bg-cyan-300/12 blur-3xl" />
            <div className="rounded-[30px] border-4 border-neutral-900 bg-[#161719] p-1.5 shadow-[0_9px_20px_rgba(0,0,0,0.5),0_37px_37px_rgba(0,0,0,0.36),0_84px_50px_rgba(0,0,0,0.22)] sm:p-2">
              <div className="relative rounded-[22px] border border-white/10 bg-[#0e1011] p-2 sm:p-3">
                <div className="absolute top-0 left-[15%] h-px w-[70%] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                <ReelslaunchHeroComposer
                  appearance="console"
                  enableFrameInputs
                  allowVideoMode={false}
                  compactAction
                  compactHeight
                  labels={composerLabels()}
                  requireReferences={false}
                  onGenerate={(values) => {
                    saveVideoComposerDraft(values);
                    router.push(
                      `/text-to-video?prompt=${encodeURIComponent(values.prompt)}`
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-8 flex items-center gap-3 text-sm text-neutral-500">
            <Check className="size-4 text-cyan-300" /> No credit card required
            to explore the editor
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-28 px-5 pb-12 sm:px-8 sm:pb-16"
        >
          <div className="mb-12 max-w-xl">
            <p className="text-xs font-medium tracking-[0.22em] text-cyan-300 uppercase">
              The workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-[28px] border border-white/[0.09] bg-[#0e1012] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-8"
                >
                  <div className="flex items-center gap-3 text-cyan-300">
                    <FeatureIcon className="size-5" strokeWidth={1.5} />
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                      Step {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl leading-tight font-medium tracking-[-0.045em] text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-400 sm:text-base">
                    {feature.body}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-transparent p-7 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="text-2xl font-medium tracking-[-0.03em]">
                Ready when the idea is.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Open the full workspace and turn this direction into a finished
                clip.
              </p>
            </div>
            <Link
              href="/text-to-video"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Open workspace{' '}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/8 bg-[#0b0d0f] pt-16 pb-24 sm:pt-20 md:pt-24 md:pb-32">
          <div className="w-full">
            <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/8">
                <Sparkles className="size-5 text-cyan-300" />
              </div>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
                Built on MiniMax H3 Max
              </h2>
              <p className="mt-5 text-neutral-400">
                Generate 5–15 second clips with native audio, 480p or 768p
                output, and six aspect ratios for faceless Instagram channels.
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between px-[clamp(1.25rem,4vw,4.5rem)] md:mt-16">
              <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
                Made with H3 Max
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Scroll video gallery left"
                  onClick={() => moveGallery(-1)}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll video gallery right"
                  onClick={() => moveGallery(1)}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
            <ul
              ref={galleryRef}
              aria-label="H3 Max video examples and workflow features"
              className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-0 pb-6 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
            >
              {tools.map((item, index) => (
                <li
                  key={item.title}
                  className="w-[min(84vw,520px)] shrink-0 snap-start sm:w-[min(68vw,520px)] lg:w-[min(46vw,520px)]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <article className="h-full">
                    <div className="mb-5 min-h-[12.5rem] max-w-lg px-1">
                      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-cyan-300 uppercase">
                        <span className="size-1.5 rounded-full bg-cyan-300" />
                        {index < 4 ? 'Workflow' : 'Made with H3 Max'}
                      </div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400 sm:text-base">
                        {item.description}
                      </p>
                      {item.linkText ? (
                        <Link
                          href="/text-to-video"
                          className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200"
                        >
                          {item.linkText}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ) : null}
                    </div>
                    <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#101214] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-3">
                      <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-black">
                        <GalleryVideoPreview
                          src={item.video}
                          poster={item.poster}
                          title={item.title}
                        />
                      </div>
                      <div className="absolute bottom-3 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            <p className="px-[clamp(1.25rem,4vw,4.5rem)] text-xs text-neutral-600">
              Swipe or use the arrows to explore more scenes.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 text-neutral-300 sm:px-8 sm:py-28">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-cyan-300 uppercase">
                Production after generation
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                From Clip to Published Reel
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-neutral-400">
              Review each generated clip, keep approved videos in a queue, and
              set a publishing rhythm for Instagram Reels. While one clip is
              waiting for its slot, you can prepare the next prompt and keep a
              faceless channel supplied.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              [
                '01',
                'Review the result',
                'Check motion, native audio, framing, and duration before approval.',
              ],
              [
                '02',
                'Build the queue',
                'Keep approved H3 Max clips organized for the next publishing slots.',
              ],
              [
                '03',
                'Set the cadence',
                'Connect Instagram and let the planned workflow move toward Reels posts.',
              ],
            ].map(([number, title, body]) => (
              <article
                key={number}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-cyan-300">
                  {number}
                </span>
                <h3 className="mt-8 text-xl font-medium text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <Pricing
          compact
          title="H3 Max Clip Pricing"
          description="Choose the $29 Start, $79 Creator, or $149 Studio tier, then view the full credit details on the pricing page."
        />

        <section className="mx-auto max-w-3xl px-5 py-28 sm:px-8 md:py-40">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
              FAQ
            </h2>
          </div>
          <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
            {reelslaunchFaqs.map(([question, answer], index) => (
              <details key={question} className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-medium">
                  {question}
                  <ChevronDown className="size-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180 group-open:text-cyan-300" />
                </summary>
                <p className="max-w-2xl pr-8 pb-6 text-sm leading-7 text-neutral-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl border-t border-white/10 px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            More H3 Max Tools
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">
            Explore the full generator, compare credit plans, or read the
            focused model overview before you start a batch of clips.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/text-to-video"
              className="rounded-full border border-cyan-200/30 px-4 py-2 text-cyan-100 transition-colors hover:border-cyan-200 hover:bg-cyan-200/10"
            >
              H3 Max text to video
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-cyan-200/30 px-4 py-2 text-cyan-100 transition-colors hover:border-cyan-200 hover:bg-cyan-200/10"
            >
              H3 Max pricing
            </Link>
            <Link
              href="/h3-max-video-generator"
              className="rounded-full border border-cyan-200/30 px-4 py-2 text-cyan-100 transition-colors hover:border-cyan-200 hover:bg-cyan-200/10"
            >
              H3 Max video generator overview
            </Link>
            <Link
              href="/can-chatgpt-create-videos"
              className="rounded-full border border-white/15 px-4 py-2 text-neutral-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Read the ChatGPT video guide
            </Link>
          </div>
        </section>

        <section
          className="relative overflow-hidden border-t border-white/8 px-5 py-28 sm:px-8 md:py-40"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          {ctaHovered ? (
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="pointer-events-none opacity-80"
              colors={[
                [59, 130, 246],
                [139, 92, 246],
              ]}
              opacities={[0.2, 0.2, 0.2, 0.35, 0.5, 0.8]}
              dotSize={2}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(57,195,239,0.18),transparent_32%)]" />
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-between gap-10 md:flex-row">
            <div>
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Start your first faceless Reels channel.
              </h2>
              <p className="mt-6 max-w-lg leading-7 text-neutral-400">
                Create H3 Max clips, keep native audio, and build a repeatable
                Instagram Reels publishing workflow from one workspace.
              </p>
            </div>
            <Link
              href="/text-to-video"
              className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-black"
            >
              Start free{' '}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative z-10 mx-auto mt-20 max-w-5xl overflow-hidden rounded-t-3xl border-x border-t border-white/15 bg-[#101214] p-3 shadow-[0_-10px_70px_rgba(255,255,255,0.08)]">
            <video
              src="/reelslaunch-showcase/workspace-preview.mp4"
              poster="/reelslaunch-showcase/posters/fourth.png"
              aria-label="reelslaunch video workspace preview"
              width={886}
              height={665}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full rounded-2xl object-cover opacity-80"
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[#08090a] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-white">{REEL_AUTOPILOT_NAME}</span>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
            <a
              href="mailto:zyrliuwei@gmail.com"
              className="transition-colors hover:text-white"
            >
              Contact us
            </a>
          </nav>
          <span>
            © {new Date().getFullYear()} {REEL_AUTOPILOT_NAME}
          </span>
        </div>
        <FooterBadgeList className="mx-auto mt-8 max-w-6xl sm:px-8" />
      </footer>
    </div>
  );
}
