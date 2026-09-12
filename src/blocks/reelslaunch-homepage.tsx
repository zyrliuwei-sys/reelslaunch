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
import {
  ReelslaunchHeroComposer,
  type ReelslaunchHeroComposerLabels,
} from '@/components/reelslaunch/hero-composer';
import { HomepageCreatorsNote } from '@/components/reelslaunch/homepage-creators-note';
import { HomepageShortAnswer } from '@/components/reelslaunch/homepage-short-answer';
import { HomepageWorkflowComparison } from '@/components/reelslaunch/homepage-workflow-comparison';
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
    title: 'Describe the shot',
    body: 'Start with a sentence. The editor turns your direction into a cinematic brief.',
  },
  {
    icon: Layers3,
    title: 'Direct every frame',
    body: 'Add first and last frames, references, aspect ratio, and resolution in one place.',
  },
  {
    icon: Gauge,
    title: 'Move from idea to render',
    body: 'Keep the creative context intact while you move into the full video workspace.',
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
    'Can reelslaunch generate H3 Max videos?',
    'Yes. reelslaunch uses H3 Max to turn a written direction into a short clip with native audio. Describe the subject, movement, setting, and visual style, then review the generated result before adding it to a publishing queue. Available controls, resolution choices, duration limits, and generation costs are shown in the workspace so you can choose settings that suit each idea.',
  ],
  [
    'Can I create Instagram Reels with reelslaunch?',
    'Yes. Create a vertical-ready clip, review the result, and prepare it for your Instagram workflow. reelslaunch helps keep the production steps together, including generation, queue organization, and scheduled publishing. You remain in control of the final content and posting cadence, while the queue reduces the need to manually move every finished video through the same sequence.',
  ],
  [
    'Can reelslaunch generate videos in batches?',
    'reelslaunch is designed to help creators prepare a continuing queue of short H3 Max clips for a faceless channel. Organize multiple ideas, generate videos asynchronously, review each result, and move approved clips toward planned publishing slots. Generation capacity and completion time depend on selected settings and current demand, so the queue supports repeatable production without promising a fixed turnaround for every clip.',
  ],
  [
    'How fast can reelslaunch create videos?',
    'reelslaunch uses H3 Max to create short 3-second and 5-second clips with native audio, and submits requests through a fast asynchronous queue. Actual completion time varies with demand and the settings selected for a generation. The queue also helps with what follows: completed clips can be reviewed, organized, and prepared for a planned Instagram Reels schedule instead of waiting in a manual upload workflow.',
  ],
  [
    'Does reelslaunch automatically publish Instagram Reels?',
    'Yes. Connect your Instagram workflow, choose a publishing cadence, and reelslaunch can move queued clips into scheduled Instagram Reels publishing. You can prepare additional videos while the queue runs instead of repeating the same upload steps for every post. Review the clips and schedule before publishing, and make sure the connected account and permissions are set up for the workflow you want to use.',
  ],
  [
    'Is reelslaunch free to try?',
    'You can open the reelslaunch workspace and explore prompt and video settings before choosing a plan. Video generation uses credits according to the current resolution and duration pricing, and any trial or introductory offer will be shown in the product when available. Check the live plan details before submitting paid generations, since plan features and promotional availability can change over time.',
  ],
] as const;

const featureDetails = [
  [
    { value: 'One sentence', label: 'to set the scene' },
    { value: 'Cinematic brief', label: 'to shape the direction' },
    { value: 'Your idea', label: 'stays in focus' },
  ],
  [
    { value: 'First + last', label: 'frames to guide motion' },
    { value: 'References', label: 'to anchor the look' },
    { value: 'One editor', label: 'for framing and detail' },
  ],
  [
    { value: 'H3 Max', label: 'short-form generation' },
    { value: 'Native audio', label: 'in the finished clip' },
    { value: 'One workspace', label: 'from idea to render' },
  ],
] as const;

export function ReelslaunchHomepage() {
  const router = useRouter();
  const [ctaHovered, setCtaHovered] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const activeFeature = features[activeFeatureIndex]!;
  const ActiveFeatureIcon = activeFeature.icon;
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
            poster="/logo.png"
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
            Can ChatGPT Create Videos? Yes, But Here&apos;s What It Can&apos;t
            Do
          </h1>
          <p className="relative z-10 mt-7 max-w-2xl text-center text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            ChatGPT can create videos, but reelslaunch is built for creators who
            want fast H3 Max clips and automatic Instagram Reels publishing.
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

        <HomepageShortAnswer />
        <HomepageWorkflowComparison />
        <HomepageCreatorsNote />

        <section className="mx-auto max-w-4xl px-5 py-16 text-neutral-300 sm:px-8 sm:py-20">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            ChatGPT Video Generator
          </h2>
          <p className="mt-6 text-base leading-7">
            A ChatGPT video generator workflow starts with an idea expressed in
            ordinary language. Describe the subject, setting, movement, visual
            style, and intended audience, then refine the prompt until the
            direction is clear. ChatGPT can support ideation and prompt writing;
            video-generation access determines which models and formats are
            available. For creators making short-form content, the useful
            question is not only whether a prompt can become a clip, but also
            whether the result fits a consistent channel plan. H3 Max helps turn
            a concise direction into short video drafts that can be reviewed
            before they move into production.
          </p>
          <p className="mt-5 text-base leading-7">
            Reelslaunch brings the generation settings into one focused
            workspace. Set a prompt, select the framing and resolution, and
            choose a short duration suited to the idea. Native audio is included
            in the generated clip, so the first review can consider the full
            audiovisual result rather than a silent placeholder. Creators can
            organize multiple concepts for a faceless channel, compare drafts,
            and keep the work moving without rebuilding every setup from
            scratch. Generation is charged according to the selected model,
            resolution, and duration; check the live pricing details before
            submitting a render.
          </p>
          <p className="mt-5 text-base leading-7">
            Once a clip is ready, the next step is preparing it for publication.
            Queue approved videos, connect the Instagram workflow, and choose a
            schedule that suits the channel. This makes a ChatGPT video
            generator part of a wider repeatable process—from initial direction
            to reviewed clip and planned Instagram Reels post. To explore the
            controls and create a first draft, open the{' '}
            <Link
              href="/text-to-video"
              className="text-cyan-200 underline underline-offset-4"
            >
              H3 Max text-to-video workspace
            </Link>
            .
          </p>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-28 px-5 pb-12 sm:px-8 sm:pb-16"
        >
          <div className="mb-12 max-w-xl">
            <p className="text-xs font-medium tracking-[0.22em] text-cyan-300 uppercase">
              A calmer way to create
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Less prompting. More directing.
            </h2>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0e1012] shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-start justify-between gap-5 border-b border-white/[0.07] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
              <div>
                <p className="text-[10px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                  Explore the workflow
                </p>
                <p className="mt-1 text-sm text-neutral-300">
                  Select a step to see what you can direct.
                </p>
              </div>
              <label className="relative flex min-h-11 w-full items-center rounded-full border border-white/[0.12] bg-white/[0.045] pr-10 pl-4 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] sm:w-auto sm:min-w-64">
                <span className="sr-only">Choose a workflow step</span>
                <select
                  aria-label="Choose a workflow step"
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded-full opacity-0"
                  value={activeFeatureIndex}
                  onChange={(event) =>
                    setActiveFeatureIndex(Number(event.currentTarget.value))
                  }
                >
                  {features.map((feature, index) => (
                    <option key={feature.title} value={index}>
                      {String(index + 1).padStart(2, '0')} · {feature.title}
                    </option>
                  ))}
                </select>
                <span aria-hidden="true" className="truncate">
                  {String(activeFeatureIndex + 1).padStart(2, '0')}{' '}
                  <span className="px-2 text-neutral-600">/</span>{' '}
                  {activeFeature.title}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="absolute right-4 size-4 text-neutral-400"
                />
              </label>
            </div>

            <div
              aria-live="polite"
              className="grid min-h-[310px] gap-10 px-6 py-9 sm:px-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)] md:items-center md:gap-14"
            >
              <div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <ActiveFeatureIcon className="size-5" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                    Step {String(activeFeatureIndex + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 max-w-xl text-3xl leading-tight font-medium tracking-[-0.045em] text-white sm:text-4xl">
                  {activeFeature.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
                  {activeFeature.body}
                </p>
              </div>

              <div className="grid grid-cols-1 divide-y divide-white/[0.08] border-y border-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {featureDetails[activeFeatureIndex]!.map((detail) => (
                  <div
                    key={detail.value}
                    className="py-5 sm:px-4 sm:py-2 first:sm:pl-0 last:sm:pr-0"
                  >
                    <p className="text-base font-medium tracking-[-0.02em] text-white sm:text-sm lg:text-base">
                      {detail.value}
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-neutral-500">
                      {detail.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/8">
                <Sparkles className="size-5 text-cyan-300" />
              </div>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
                Every scene. Every sound.
              </h2>
              <p className="mt-5 text-neutral-400">
                Create short clips, keep native audio, and automate the work of
                publishing a faceless Reels channel.
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between px-5 sm:px-8 md:mt-16">
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
              className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 pb-6 [scrollbar-width:none] sm:gap-6 sm:px-8 [&::-webkit-scrollbar]:hidden"
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
            <p className="px-5 text-xs text-neutral-600 sm:px-8">
              Swipe or use the arrows to explore more scenes.
            </p>
          </div>
        </section>

        <Pricing compact />

        <section className="mx-auto max-w-3xl px-5 py-28 sm:px-8 md:py-40">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
              Frequently asked questions.
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
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 md:flex-row">
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
              href="/sign-up"
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
      </footer>
    </div>
  );
}
