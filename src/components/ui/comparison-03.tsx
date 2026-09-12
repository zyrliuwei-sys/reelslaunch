import { ArrowRight, Check } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

const comparisons = [
  {
    label: 'Create',
    before: 'Generate a clip, then move it into the next tool.',
    after: 'Create short H3 Max clips with native audio in one workspace.',
  },
  {
    label: 'Organize',
    before: 'Track prompts, exports, and publishing dates by hand.',
    after: 'Queue ideas for a faceless channel and keep production moving.',
  },
  {
    label: 'Publish',
    before: 'Export, upload, and schedule every social clip manually.',
    after: 'Plan and schedule Instagram Reels in the same workflow.',
  },
] as const;

const Comparison03 = () => (
  <div className="w-full">
    <div className="grid grid-cols-2 gap-x-5 md:grid-cols-[112px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8">
      <div className="hidden pb-4 md:block" />
      <div className="pb-4 font-mono text-[10px] font-medium tracking-[0.14em] text-neutral-500 uppercase">
        ChatGPT Video
      </div>
      <div className="pb-4 font-mono text-[10px] font-medium tracking-[0.14em] text-cyan-200 uppercase">
        reelslaunch
      </div>

      {comparisons.map((item, index) => (
        <div key={item.label} className="contents">
          <div className="col-span-2 border-t border-white/[0.09] pt-5 pb-1 font-mono text-[10px] tracking-[0.12em] text-neutral-600 uppercase md:col-span-1 md:py-7">
            <span className="mr-2 text-cyan-200/80">0{index + 1}</span>
            {item.label}
          </div>
          <p className="border-t border-white/[0.09] py-4 text-sm leading-6 text-neutral-400 md:py-7">
            {item.before}
          </p>
          <p className="border-t border-white/[0.09] py-4 text-sm leading-6 text-neutral-100 md:py-7">
            <Check aria-hidden className="mr-2 inline size-3.5 text-cyan-200" />
            {item.after}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-6 flex flex-col gap-5 border-t border-white/[0.09] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {[
          ['H3 Max', 'short-form generation'],
          ['Queue', 'batch-ready workflow'],
          ['Reels', 'scheduled publishing'],
        ].map(([value, label]) => (
          <p key={value} className="text-xs text-neutral-500">
            <span className="mr-2 font-mono font-semibold text-cyan-100">{value}</span>
            {label}
          </p>
        ))}
      </div>
      <Link
        href="/text-to-video"
        className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-white transition-colors hover:text-cyan-100"
      >
        Try the workflow
        <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
);

export default Comparison03;
