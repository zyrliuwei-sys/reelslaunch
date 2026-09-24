import { Link } from '@/core/i18n/navigation';

const sectionClassName = 'border-t border-white/10 py-16 sm:py-24';
const innerClassName = 'mx-auto max-w-6xl px-5 sm:px-8';

const faqs = [
  [
    'What is the reelslaunch H3 Max video generator?',
    'It is a focused workspace for turning a written direction into a short clip with the MiniMax H3 Max model, native audio, selectable framing, and a review-to-publishing workflow for Instagram Reels.',
  ],
  [
    'What can I control in H3 Max text to video?',
    'You can describe the subject, action, camera movement, setting, and mood, then choose a duration, aspect ratio, and resolution before submitting the generation.',
  ],
  [
    'How long are the generated clips?',
    'The current workflow supports 5–15 second clips. Use a shorter clip to test an idea, or choose a longer duration when the scene needs more time to read.',
  ],
  [
    'Can I use the generated clip for Instagram Reels?',
    'Yes. Review the result, add approved clips to the queue, connect the Instagram workflow, and choose a publishing cadence for planned Reels posts.',
  ],
] as const;

export function H3MaxVideoGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#08090a] text-neutral-300">
      <section className="relative overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(57,195,239,0.18),transparent_35%),radial-gradient(circle_at_10%_70%,rgba(53,83,255,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">
            MiniMax H3 Max workflow
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.06em] text-white sm:text-7xl">
            H3 Max Video Generator for Instagram Reels
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-400 sm:text-xl">
            Create short, native-audio clips with the reelslaunch H3 Max video
            generator. Write a direction, choose the framing and detail level,
            then move approved results into a repeatable Reels publishing queue.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/text-to-video"
              className="rounded-full bg-cyan-100 px-5 py-3 text-sm font-semibold text-[#071014] transition-colors hover:bg-white"
            >
              Open H3 Max text to video
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-200/60 hover:bg-white/10"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className={innerClassName}>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            How the H3 Max Video Generator Works
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [
                '01',
                'Describe the shot',
                'Write the subject, movement, setting, camera language, and mood in plain language.',
              ],
              [
                '02',
                'Set the output',
                'Choose a duration from 5–15 seconds, one of six aspect ratios, and 480p or 768p.',
              ],
              [
                '03',
                'Review and queue',
                'Inspect the native-audio result, approve it, and send it toward your Instagram Reels cadence.',
              ],
            ].map(([number, title, body]) => (
              <article
                key={number}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"
              >
                <p className="font-mono text-xs tracking-[0.2em] text-cyan-300">
                  {number}
                </p>
                <h3 className="mt-8 text-xl font-medium text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <div
          className={`${innerClassName} grid gap-10 lg:grid-cols-2 lg:gap-20`}
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">
              Model overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Built for clear short-form direction
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-neutral-400">
            <p>
              The MiniMax H3 Max model is a practical fit when a social clip
              needs more than a static visual: the generated result includes
              native audio, and the workspace keeps the prompt, framing, and
              duration choices together for review.
            </p>
            <p>
              Use 480p when testing several ideas with predictable spend. Move
              to 768p when texture, lighting, or close subjects need more
              detail. Six aspect ratios make the same creative direction easier
              to adapt for vertical Reels, square posts, and wider placements.
            </p>
            <p>
              If you want to compare the model workflow with the available
              credit bundles, see the{' '}
              <Link
                href="/pricing"
                className="text-cyan-200 underline underline-offset-4"
              >
                Video pricing plans
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className={innerClassName}>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            H3 Max Text to Video Features
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                'Native audio',
                'Review the full audiovisual result before publishing.',
              ],
              [
                '5–15 seconds',
                'Create concise clips that are easy to sequence in a channel.',
              ],
              [
                '480p and 768p',
                'Balance iteration speed with detail for the final render.',
              ],
              [
                'Six ratios',
                'Shape the output for vertical, square, or wider social formats.',
              ],
            ].map(([title, body]) => (
              <article key={title} className="border-l border-cyan-200/40 pl-5">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className={`${innerClassName} max-w-4xl`}>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            FAQ
          </h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left font-medium text-white">
                  {question}
                  <span
                    className="text-cyan-200 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 text-sm leading-7 text-neutral-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8 sm:py-24">
        <div
          className={`${innerClassName} flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Ready to generate a clip?
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Start with H3 Max text to video, or return to the AI Reels
              Generator homepage.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/text-to-video"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-100"
            >
              Open the workspace
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to reelslaunch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
