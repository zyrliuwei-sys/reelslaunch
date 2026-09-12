import { ArrowUpRight, CircleDashed, Clock3, Layers3 } from 'lucide-react';

const points = [
  'You need the right subscription and video-generation access.',
  'Individual generations can be slow when you need a steady content queue.',
  'There is no built-in faceless-channel batch autopilot for every creator.',
];

export function HomepageShortAnswer() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
            The short answer
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
            Yes, but there are limits.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-neutral-500">
          Making a clip is one step. Keeping a channel moving takes a workflow.
          You still have to export, schedule, and publish each social clip
          manually.
        </p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <article className="group relative min-h-56 overflow-hidden rounded-2xl border border-cyan-200/20 bg-[radial-gradient(ellipse_at_top_left,rgba(103,232,249,0.11),transparent_55%),#0d0f10] p-6 transition-colors hover:border-cyan-200/40 sm:col-span-2 sm:p-8 lg:col-span-3 lg:row-span-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.18em] text-cyan-100/70 uppercase">
              01 / Access
            </span>
            <CircleDashed aria-hidden className="size-5 text-cyan-200" />
          </div>
          <p className="mt-12 max-w-md text-2xl leading-snug font-medium tracking-tight text-white sm:text-3xl">
            You need the right subscription and video-generation access.
          </p>
          <div className="absolute right-7 bottom-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
            <span className="size-1.5 rounded-full bg-cyan-300" />
            Access required
          </div>
        </article>

        <article className="group relative min-h-48 overflow-hidden rounded-2xl border border-white/10 bg-[#101214] p-6 transition-colors hover:border-white/20 sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
              02 / Throughput
            </span>
            <Clock3 aria-hidden className="size-5 text-cyan-200" />
          </div>
          <p className="mt-8 max-w-lg text-lg leading-7 text-neutral-200">
            {points[1]}
          </p>
          <div aria-hidden className="mt-5 flex h-5 items-end gap-1 opacity-70">
            {[8, 13, 9, 17, 11, 7, 15, 10, 19, 12, 8, 14].map((height, i) => (
              <span
                key={i}
                className="w-1.5 rounded-t-sm bg-cyan-300/70"
                style={{ height: `${height}px` }}
              />
            ))}
            <span className="ml-2 self-center font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
              One at a time
            </span>
          </div>
        </article>

        <article className="group min-h-44 rounded-2xl border border-white/10 bg-[#101214] p-6 transition-colors hover:border-white/20 sm:col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.18em] text-neutral-500 uppercase">
              03 / Batch
            </span>
            <Layers3 aria-hidden className="size-5 text-cyan-200" />
          </div>
          <p className="mt-7 text-base leading-7 text-neutral-200">
            {points[2]}
          </p>
        </article>
      </div>

      <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0b0d0e] px-5 py-4 text-sm leading-6 text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          OpenAI explains its video-generation capabilities in the{' '}
          <a
            className="text-cyan-200 underline decoration-cyan-200/50 underline-offset-4 hover:decoration-cyan-200"
            href="https://help.openai.com/en/articles/8932459-sora-frequently-asked-questions"
            rel="noreferrer"
          >
            official Sora FAQ
          </a>
          . Creator discussions on{' '}
          <a
            className="text-cyan-200 underline decoration-cyan-200/50 underline-offset-4 hover:decoration-cyan-200"
            href="https://www.reddit.com/r/ChatGPT/"
            rel="noreferrer"
          >
            Reddit&apos;s ChatGPT community
          </a>{' '}
          also show why a production queue and social scheduling layer matter.
        </p>
        <ArrowUpRight
          aria-hidden
          className="hidden size-4 shrink-0 text-cyan-200 sm:block"
        />
      </div>
    </section>
  );
}
