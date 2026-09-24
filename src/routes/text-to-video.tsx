import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { Link, useRouter } from '@/core/i18n/navigation';
import {
  PRODUCT_SOCIAL_IMAGE_URL,
  SITE_URL,
  siteSeo,
} from '@/lib/motion-control-seo';
import { TextToVideo } from '@/blocks/text-to-video';

const textToVideoSearchSchema = z.object({
  prompt: z.string().max(4000).optional(),
});
const canonicalUrl = `${SITE_URL}${siteSeo.textToVideo.path}`;

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: siteSeo.textToVideo.title.split(' | ')[0],
      item: canonicalUrl,
    },
  ],
};

function TextToVideoRoute() {
  const { prompt } = Route.useSearch();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        event.isComposing
      ) {
        return;
      }

      event.preventDefault();
      router.push('/');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const workspaceIntro = (
    <article className="mx-auto max-w-4xl px-5 pt-8 pb-10 text-neutral-300 sm:px-8 sm:pt-10 sm:pb-12">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        H3 Max Text to Video Generator
      </h1>
      <p className="mt-4 text-base leading-6 sm:mt-5 sm:leading-7">
        H3 Max text to video turns a written direction into a short clip you can
        review, refine, and use in a publishing workflow. Describe the subject,
        action, setting, camera movement, and mood in one prompt; the generator
        uses those details to shape a coherent shot instead of asking you to
        assemble a timeline first. Create clips from 5 to 15 seconds and choose
        from six aspect ratios for vertical Reels, square social posts, or wider
        video placements. You can begin with text and keep the creative
        direction in one workspace from the first draft onward.
      </p>
      <p className="mt-4 text-base leading-6 sm:mt-5 sm:leading-7">
        Choose resolution and duration together. 480p is a practical option when
        you want to explore more seconds or test several prompt ideas while
        keeping generation spend predictable. 768p gives a frame more detail
        when texture, lighting, or a close subject matters. H3 Max video
        generation is priced by the second, so the selected resolution and clip
        length determine the generation cost. A shorter 480p draft can help
        validate motion before you spend more on a detailed render; once the
        direction works, adjust the duration or resolution to fit the finished
        post.
      </p>
      <p className="mt-4 text-base leading-6 sm:mt-5 sm:leading-7">
        From generation to publishing, the workflow is designed to reduce
        repeated manual steps. Create a clip with native audio, review the
        result, then add it to a queue and schedule it for Instagram Reels. Set
        the publishing cadence once and keep preparing the next clips while the
        schedule runs. If you are comparing workflows, return to the{' '}
        <Link
          href="/h3-max-video-generator"
          className="text-cyan-200 underline underline-offset-4"
        >
          H3 Max video generator overview
        </Link>{' '}
        for a concise product introduction, or visit the{' '}
        <Link
          href="/pricing"
          className="text-cyan-200 underline underline-offset-4"
        >
          pricing page
        </Link>{' '}
        to compare credit plans.
      </p>

      <section className="mt-10 sm:mt-14" aria-labelledby="text-to-video-how">
        <h2
          id="text-to-video-how"
          className="text-2xl font-semibold text-white sm:text-3xl"
        >
          How H3 Max Text to Video Works
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [
              'Write the direction',
              'Describe the subject, action, setting, camera movement, lighting, and mood.',
            ],
            [
              'Choose the output',
              'Set a 5–15 second duration, one of six aspect ratios, and 480p or 768p resolution.',
            ],
            [
              'Review and publish',
              'Check the native-audio result, approve it, then queue it for the Instagram Reels schedule.',
            ],
          ].map(([title, description], index) => (
            <article
              key={title}
              className="rounded-xl border border-white/10 bg-white/[0.035] p-5"
            >
              <p className="font-mono text-xs tracking-[0.18em] text-cyan-200">
                0{index + 1}
              </p>
              <h3 className="mt-5 text-lg font-medium text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mt-10 border-t border-white/10 pt-10 sm:mt-14 sm:pt-14"
        aria-labelledby="text-to-video-models"
      >
        <h2
          id="text-to-video-models"
          className="text-2xl font-semibold text-white sm:text-3xl"
        >
          H3 Max and Other Video Models
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7">
          MiniMax H3 Max is a strong fit when a short social clip needs native
          audio, clear duration controls, and repeatable framing choices in one
          workflow. Other video models may emphasize a different visual style,
          longer scenes, or image-first inputs. reelslaunch keeps this page
          focused on the H3 Max text to video path so you can compare a prompt,
          a resolution, and a per-second cost before you generate.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7">
          When you are ready to compare bundles, open{' '}
          <Link
            href="/pricing"
            className="text-cyan-200 underline underline-offset-4"
          >
            H3 Max pricing
          </Link>{' '}
          or return to the{' '}
          <Link href="/" className="text-cyan-200 underline underline-offset-4">
            AI Reels Generator homepage
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 sm:mt-10" aria-labelledby="text-to-video-faq">
        <h2
          id="text-to-video-faq"
          className="text-2xl font-semibold text-white"
        >
          FAQ
        </h2>
        <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              Is H3 Max text to video free to try?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              You can explore the workspace and prepare a prompt before
              generating. Video generation uses credits at the displayed
              per-second rate, so review the selected resolution, duration, and
              available balance before submitting a clip.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              What resolution and duration should I pick?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              Start with 480p and a shorter duration when testing motion or
              comparing prompts. Choose 768p when fine visual detail matters,
              and increase the duration only when the idea needs more time to
              read. Pricing is calculated per second at the chosen resolution.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              Can I send the clip straight to Instagram Reels?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              Yes. Add a generated clip to your publishing queue, connect your
              Instagram workflow, and choose a schedule. The queue helps move
              finished videos from generation into planned Reels publishing
              without manually uploading every clip one at a time.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              How are credits calculated for a clip?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              Credits are charged by output seconds. 768p uses the standard
              rate, while 480p uses fewer credits for the same duration. The
              chosen resolution and clip length determine the estimate shown
              before generation.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              Which aspect ratios are available?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              The workspace offers six aspect ratios for vertical Reels, square
              social posts, and wider placements. Pick the ratio before
              submitting so the prompt is reviewed in the intended frame.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              Does the generated video include audio?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              Yes. The MiniMax H3 Max workflow includes native audio in the
              generated clip, so you can review the audiovisual result before
              adding it to the publishing queue.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              Can I use prompts or references from an earlier draft?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              You can refine the written direction and use the workspace
              controls to keep the framing and output settings consistent as you
              iterate on a concept.
            </p>
          </details>
          <details className="py-4">
            <summary className="cursor-pointer font-medium text-white">
              Where can I compare plans before generating?
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
              Visit the{' '}
              <Link
                href="/pricing"
                className="text-cyan-200 underline underline-offset-4"
              >
                pricing page
              </Link>{' '}
              to compare the Start, Creator, and Studio credit plans, then
              return to the workspace when you are ready.
            </p>
          </details>
        </div>
      </section>
    </article>
  );

  return (
    <TextToVideo
      initialPrompt={prompt}
      workspaceIntro={workspaceIntro}
      showTemplateFeed={false}
    />
  );
}

export const Route = createFileRoute('/text-to-video')({
  validateSearch: textToVideoSearchSchema,
  head: () => ({
    meta: [
      { title: siteSeo.textToVideo.title },
      { name: 'description', content: siteSeo.textToVideo.description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteSeo.textToVideo.title },
      {
        property: 'og:description',
        content: siteSeo.textToVideo.description,
      },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: PRODUCT_SOCIAL_IMAGE_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteSeo.textToVideo.title },
      {
        name: 'twitter:description',
        content: siteSeo.textToVideo.description,
      },
      {
        name: 'twitter:image',
        content: PRODUCT_SOCIAL_IMAGE_URL,
      },
      { 'script:ld+json': breadcrumbStructuredData },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }),
  component: TextToVideoRoute,
});
