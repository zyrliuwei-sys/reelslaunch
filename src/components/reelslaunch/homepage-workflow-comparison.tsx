import Comparison03 from '@/components/ui/comparison-03';

export function HomepageWorkflowComparison() {
  return (
    <section
      id="workflow"
      className="mx-auto max-w-6xl scroll-mt-28 px-5 py-12 sm:px-8 sm:py-16"
    >
      <div>
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
              The workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
              ChatGPT Video vs reelslaunch
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-neutral-400 sm:text-right">
            The difference is not whether a tool can make one video. It is what
            happens after the idea.
          </p>
        </div>
        <Comparison03 />
      </div>
    </section>
  );
}
