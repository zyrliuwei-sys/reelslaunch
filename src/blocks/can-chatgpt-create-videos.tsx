import { ChevronDown } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { HomepageCreatorsNote } from '@/components/reelslaunch/homepage-creators-note';
import { HomepageShortAnswer } from '@/components/reelslaunch/homepage-short-answer';
import { HomepageWorkflowComparison } from '@/components/reelslaunch/homepage-workflow-comparison';

export const chatgptFaqs = [
  [
    'Can ChatGPT create videos?',
    'Yes, with the right video-generation access. ChatGPT can help shape the idea or prompt, while a video model turns that direction into a clip. reelslaunch uses MiniMax H3 Max for short clips with native audio, then adds the queue and Instagram Reels workflow around the generated result.',
  ],
  [
    'Can ChatGPT make videos for Instagram Reels?',
    'A generated clip can be prepared for Instagram Reels, but making a channel work also requires the right framing, review step, publishing cadence, and account connection. reelslaunch keeps those production steps together so an approved clip can move into a planned Reels queue.',
  ],
  [
    'Can ChatGPT make video content in batches?',
    'ChatGPT can help generate ideas and prompts in batches, but repeatable video production depends on the model, queue capacity, and publishing workflow. reelslaunch is designed for a continuing queue of short MiniMax H3 Max clips for faceless channels, with each result available for review before scheduling.',
  ],
  [
    'How fast can reelslaunch create videos?',
    'reelslaunch submits short 5–15 second generations through an asynchronous queue. Completion time varies with current demand and the selected settings. The queue also keeps approved clips organized for the next Instagram Reels publishing slot.',
  ],
  [
    'Does reelslaunch automatically publish Instagram Reels?',
    'reelslaunch can move approved queued clips toward scheduled Instagram Reels publishing after the Instagram workflow and permissions are connected. You choose the cadence and review the clip before it enters the planned publishing sequence.',
  ],
  [
    'Is reelslaunch free to try?',
    'You can open the reelslaunch workspace and explore prompt, framing, and generation settings before choosing a plan. Generation uses credits according to the selected resolution and duration, so check the live pricing details before submitting a paid clip.',
  ],
] as const;

const pageClassName = 'min-h-screen bg-[#08090a] text-neutral-300';
const contentClassName = 'mx-auto max-w-6xl px-5 sm:px-8';

export function CanChatGPTCreateVideosPage() {
  return (
    <div className={pageClassName}>
      <main>
        <header className={`${contentClassName} pt-28 pb-16 sm:pt-36 sm:pb-24`}>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">
            Reelslaunch guide
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl leading-[0.98] font-semibold tracking-[-0.06em] text-white sm:text-7xl">
            Can ChatGPT Create Videos? Yes, But Here&apos;s What It Can&apos;t
            Do
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-400">
            ChatGPT can support video ideation and prompt writing, but a useful
            short-form channel also needs a generation model, review queue, and
            publishing workflow.
          </p>
        </header>

        <section className={`${contentClassName} pb-20 sm:pb-28`}>
          <div className="max-w-4xl space-y-5 text-base leading-8">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              ChatGPT Video Generator
            </h2>
            <p>
              A ChatGPT video generator workflow starts with an idea expressed
              in ordinary language. Describe the subject, setting, movement,
              visual style, and intended audience, then refine the prompt until
              the direction is clear. ChatGPT can support ideation and prompt
              writing; video-generation access determines which models and
              formats are available. For creators making short-form content, the
              useful question is not only whether a prompt can become a clip,
              but also whether the result fits a consistent channel plan.
              MiniMax H3 Max helps turn a concise direction into short video
              drafts that can be reviewed before they move into production.
            </p>
            <p>
              Reelslaunch brings the generation settings into one focused
              workspace. Set a prompt, select the framing and resolution, and
              choose a short duration suited to the idea. Native audio is
              included in the generated clip, so the first review can consider
              the full audiovisual result rather than a silent placeholder.
              Creators can organize multiple concepts for a faceless channel,
              compare drafts, and keep the work moving without rebuilding every
              setup from scratch. Generation is charged according to the
              selected model, resolution, and duration; check the live pricing
              details before submitting a render.
            </p>
            <p>
              Once a clip is ready, the next step is preparing it for
              publication. Queue approved videos, connect the Instagram
              workflow, and choose a schedule that suits the channel. This makes
              a ChatGPT video generator part of a wider repeatable process—from
              initial direction to reviewed clip and planned Instagram Reels
              post. To explore the controls and create a first draft, open the{' '}
              <Link
                href="/text-to-video"
                className="text-cyan-200 underline underline-offset-4"
              >
                H3 Max text-to-video workspace
              </Link>
              .
            </p>
          </div>
        </section>

        <HomepageShortAnswer />
        <HomepageCreatorsNote />
        <HomepageWorkflowComparison />

        <section className={`${contentClassName} py-20 sm:py-28`}>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            FAQ
          </h2>
          <div className="mt-8 max-w-4xl divide-y divide-white/10 border-y border-white/10">
            {chatgptFaqs.map(([question, answer], index) => (
              <details key={question} className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-medium text-white">
                  {question}
                  <ChevronDown className="size-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180 group-open:text-cyan-300" />
                </summary>
                <p className="max-w-3xl pr-8 pb-6 text-sm leading-7 text-neutral-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8">
        <div className={`${contentClassName} flex flex-wrap gap-5 text-sm`}>
          <Link href="/" className="text-cyan-200 hover:text-white">
            AI Reels Generator
          </Link>
          <Link
            href="/h3-max-video-generator"
            className="text-cyan-200 hover:text-white"
          >
            H3 Max video generator overview
          </Link>
          <Link href="/pricing" className="text-cyan-200 hover:text-white">
            Pricing
          </Link>
        </div>
      </footer>
    </div>
  );
}
