import { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
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
import { ReelslaunchNav } from '@/components/reelslaunch/nav';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

const REEL_AUTOPILOT_NAME = 'reelslaunch';

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

const tools = [
  [
    'H3 Max short clips',
    'Generate 3- or 5-second clips with fast-queue processing and clear per-second pricing.',
    '/reelslaunch-showcase/posters/first.png',
    '/reelslaunch-showcase/email-automation.mp4',
    'text to video workspace',
  ],
  [
    'Native audio',
    'Every finished clip comes with native audio, so there is no need to add a voice track in post.',
    '/reelslaunch-showcase/posters/second.png',
    '/reelslaunch-showcase/cross-platform.mp4',
    'native audio video generator',
  ],
  [
    'Auto-publish to Instagram Reels',
    'Set a publishing schedule once and let the queue keep your Reels workflow moving.',
    '/reelslaunch-showcase/posters/fourth.png',
    '/reelslaunch-showcase/managed-crm-office.mp4',
    'Instagram Reels scheduler',
  ],
  [
    'Batch generation',
    'Keep a faceless channel supplied with a steady queue of short-form videos.',
    '/reelslaunch-showcase/posters/third.png',
    '/reelslaunch-showcase/app-automation.mp4',
    'batch video generation',
  ],
] as const;

export const reelslaunchFaqs = [
  [
    'Can ChatGPT create videos?',
    'Yes. ChatGPT can help create video concepts and, with compatible video-generation access such as Sora, produce clips. The workflow still has limits around speed, volume, cost, and publishing.',
  ],
  [
    'Can ChatGPT make videos for Instagram Reels?',
    'It can help make a video, but turning ideas into a repeatable Reels channel still requires manual export, scheduling, captions, and publishing steps.',
  ],
  [
    'Can ChatGPT make video content in batches?',
    'ChatGPT is useful for ideation and individual generations, but it is not a faceless-channel autopilot with a batch queue and automatic social publishing.',
  ],
  [
    'How fast can reelslaunch create videos?',
    'reelslaunch uses H3 Max to create 3-second and 5-second clips with native audio, then prepares them for an automated Reels publishing schedule.',
  ],
  [
    'Does reelslaunch automatically publish Instagram Reels?',
    'Yes. Connect your workflow, choose a schedule, and reelslaunch handles the queue for Instagram Reels instead of requiring manual uploads for every clip.',
  ],
  [
    'Is reelslaunch free to try?',
    'Plans and trial availability can change. Start with the workspace to see the current offer and available generation options.',
  ],
] as const;

export function ReelslaunchHomepage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(0);
  const [ctaHovered, setCtaHovered] = useState(false);

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
            src="/reelautopilot-hero-minimax-h3.mp4"
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

        <section className="mx-auto max-w-6xl px-5 pt-24 pb-28 sm:px-8">
          <div className="relative space-y-16 before:absolute before:top-5 before:bottom-8 before:left-[11px] before:w-px before:bg-gradient-to-b before:from-cyan-300/70 before:via-white/15 before:to-transparent md:space-y-20 md:before:left-[251px]">
            <article className="relative grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16">
              <div className="relative pl-9 md:pl-0">
                <span className="absolute top-1 left-[5px] z-10 size-3.5 rounded-full border-2 border-cyan-200 bg-[#08090a] shadow-[0_0_0_5px_#08090a] md:left-[246px]" />
                <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                  The short answer
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#111315] p-6 sm:p-9">
                <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                  Yes, but there are limits.
                </h2>
                <ul className="mt-8 grid gap-4 text-sm leading-6 text-neutral-300 sm:grid-cols-2">
                  <li className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-cyan-300" />
                    You need the right subscription and video-generation access.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-cyan-300" />
                    Individual generations can be slow when you need a steady
                    content queue.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-cyan-300" />
                    There is no built-in faceless-channel batch autopilot for
                    every creator.
                  </li>
                  <li className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-cyan-300" />
                    You still have to export, schedule, and publish each social
                    clip manually.
                  </li>
                </ul>
                <p className="mt-8 text-sm leading-7 text-neutral-400">
                  OpenAI explains its video-generation capabilities in the{' '}
                  <a
                    className="text-cyan-200 underline underline-offset-4"
                    href="https://help.openai.com/en/articles/8932459-sora-frequently-asked-questions"
                    rel="noreferrer"
                  >
                    official Sora FAQ
                  </a>
                  . Creator discussions on{' '}
                  <a
                    className="text-cyan-200 underline underline-offset-4"
                    href="https://www.reddit.com/r/ChatGPT/"
                    rel="noreferrer"
                  >
                    Reddit&apos;s ChatGPT community
                  </a>{' '}
                  also show why a production queue and social scheduling layer
                  matter.
                </p>
              </div>
            </article>

            <article className="relative grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16">
              <div className="relative pl-9 md:pl-0">
                <span className="absolute top-1 left-[5px] z-10 size-3.5 rounded-full border-2 border-cyan-200 bg-[#08090a] shadow-[0_0_0_5px_#08090a] md:left-[246px]" />
                <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                  The workflow
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  ChatGPT Video vs reelslaunch
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">
                  The difference is not whether a tool can make one video. It is
                  what happens after the idea.
                </p>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0f10]">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Comparison of ChatGPT video creation and reelslaunch
                  </caption>
                  <thead className="bg-white/[0.06] text-neutral-200">
                    <tr>
                      <th className="px-5 py-4 font-medium">Capability</th>
                      <th className="px-5 py-4 font-medium">ChatGPT Video</th>
                      <th className="px-5 py-4 font-medium text-cyan-200">
                        reelslaunch
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-neutral-400">
                    <tr>
                      <th className="px-5 py-4 font-medium text-neutral-200">
                        Automatic publishing
                      </th>
                      <td className="px-5 py-4">Manual export and upload</td>
                      <td className="px-5 py-4 text-cyan-100">
                        Scheduled Instagram Reels
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-neutral-200">
                        Batch creation
                      </th>
                      <td className="px-5 py-4">Not a channel autopilot</td>
                      <td className="px-5 py-4 text-cyan-100">
                        Queue content for a faceless channel
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-neutral-200">
                        Creation speed
                      </th>
                      <td className="px-5 py-4">
                        Can take time per generation
                      </td>
                      <td className="px-5 py-4 text-cyan-100">
                        H3 Max 3-second and 5-second clips
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-neutral-200">
                        Per-clip cost
                      </th>
                      <td className="px-5 py-4">Can be high at volume</td>
                      <td className="px-5 py-4 text-cyan-100">
                        Built for repeatable short-form production
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-medium text-neutral-200">
                        Manual work
                      </th>
                      <td className="px-5 py-4">
                        Prompt, export, upload, schedule
                      </td>
                      <td className="px-5 py-4 text-cyan-100">
                        Set the workflow once, then let the queue run
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article className="relative grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16">
              <div className="relative pl-9 md:pl-0">
                <span className="absolute top-1 left-[5px] z-10 size-3.5 rounded-full border-2 border-cyan-200 bg-[#08090a] shadow-[0_0_0_5px_#08090a] md:left-[246px]" />
                <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                  For creators
                </p>
              </div>
              <div className="max-w-3xl pb-3">
                <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Can ChatGPT Make Videos? What Creators Should Know
                </h2>
                <p className="mt-6 text-base leading-8 text-neutral-400">
                  When people ask can ChatGPT make videos, they usually mean two
                  different things: can it generate a clip, and can it operate a
                  content channel? The first answer is yes with the right
                  access. The second needs a focused workflow that handles short
                  clips, native audio, a publishing queue, and Instagram Reels
                  scheduling.
                </p>
              </div>
            </article>
          </div>
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
          <div className="relative space-y-0 before:absolute before:top-5 before:bottom-5 before:left-[11px] before:w-px before:bg-gradient-to-b before:from-cyan-300/70 before:via-white/15 before:to-transparent md:before:left-[31px]">
            {features.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="relative grid gap-4 border-b border-white/[0.07] py-8 pl-9 first:pt-5 last:border-0 md:grid-cols-[64px_minmax(0,1fr)] md:gap-8 md:py-10 md:pl-0"
              >
                <span className="absolute top-9 left-[5px] z-10 grid size-[14px] place-items-center rounded-full border border-cyan-200/70 bg-[#08090a] shadow-[0_0_0_5px_#08090a] md:top-11 md:left-[25px]" />
                <div className="hidden pt-1 md:block">
                  <Icon className="size-6 text-cyan-300" strokeWidth={1.5} />
                </div>
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 md:hidden">
                    <Icon className="size-5 text-cyan-300" strokeWidth={1.5} />
                    <h3 className="text-xl font-medium">{title}</h3>
                  </div>
                  <h3 className="hidden text-2xl font-medium tracking-[-0.025em] md:block">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
                    {body}
                  </p>
                </div>
              </article>
            ))}
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

        <section className="relative overflow-hidden border-y border-white/8 bg-[#0b0d0f] px-5 pt-16 pb-28 sm:px-8 md:pt-24 md:pb-40">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/8">
                <Sparkles className="size-5 text-cyan-300" />
              </div>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                Tools for a repeatable Reels workflow.
              </h2>
              <p className="mt-5 text-neutral-400">
                Create short clips, keep native audio, and automate the work of
                publishing a faceless Reels channel.
              </p>
            </div>
            <div className="mt-20 space-y-24 md:mt-28">
              {tools.map(
                ([title, description, poster, video, linkText], index) => (
                  <article
                    key={title}
                    className={`grid items-center gap-10 md:grid-cols-2 md:gap-20 ${index % 2 ? '' : ''}`}
                  >
                    <div className={index % 2 ? 'md:order-2' : ''}>
                      <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                        <Layers3 className="size-5 text-cyan-300" />
                      </div>
                      <h3 className="text-3xl font-semibold tracking-[-0.045em]">
                        {title}
                      </h3>
                      <p className="mt-4 max-w-md leading-7 text-neutral-400">
                        {description}
                      </p>
                      <Link
                        href="/text-to-video"
                        className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-200"
                      >
                        {linkText}{' '}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                    <div className={index % 2 ? 'md:order-1' : ''}>
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101214] p-3 shadow-2xl">
                        <video
                          src={video}
                          poster={poster}
                          aria-label={`${title} workflow video preview`}
                          width={886}
                          height={665}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="aspect-[4/3] w-full rounded-xl object-cover opacity-90"
                        />
                        <div className="absolute bottom-3 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
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
              <div key={question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-medium"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  {question}
                  <ChevronDown
                    className={`size-5 shrink-0 text-neutral-500 transition-transform ${openFaq === index ? 'rotate-180 text-cyan-300' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <p className="max-w-2xl pr-8 pb-6 text-sm leading-7 text-neutral-400">
                    {answer}
                  </p>
                )}
              </div>
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
