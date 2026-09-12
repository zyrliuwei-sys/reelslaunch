import { Check } from 'lucide-react';

const points = [
  'You need the right subscription and video-generation access.',
  'Individual generations can be slow when you need a steady content queue.',
  'There is no built-in faceless-channel batch autopilot for every creator.',
  'You still have to export, schedule, and publish each social clip manually.',
];

export function HomepageShortAnswer() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
      <div className="grid gap-8 py-2 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
            The short answer
          </p>
          <h2 className="mt-5 max-w-sm text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
            Yes, but there are limits.
          </h2>
        </div>

        <div>
          <ul className="grid gap-x-8 gap-y-5 text-sm leading-6 text-neutral-300 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex gap-3">
                <Check
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-cyan-300"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-neutral-400">
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
        </div>
      </div>
    </section>
  );
}
