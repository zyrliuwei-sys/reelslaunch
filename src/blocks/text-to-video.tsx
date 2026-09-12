import type { ReactNode } from 'react';

import { envConfigs } from '@/config';
import { h3MaxRetailPlans } from '@/lib/h3-max-retail-plans';
import { m } from '@/paraglide/messages.js';
import type { ProactivVideoShowcaseCase } from '@/components/proactiv/proactiv-video-showcase';
import { ProactivVideoStudio } from '@/components/proactiv/proactiv-video-studio';
import {
  SenziaAppShell,
  type SenziaNavGroup,
} from '@/components/senzia-app-shell';

const hiddenNavigationIds = new Set([
  'image-to-video',
  'image-generator',
  'video-extender',
]);

function navGroups(): SenziaNavGroup[] {
  return m['proactiv.video.navigation.records']()
    .split('\n')
    .filter(Boolean)
    .map((row) => {
      const [label, itemsValue] = row.split('||');
      return {
        label: label || undefined,
        items: (itemsValue ?? '')
          .split('~~')
          .filter(Boolean)
          .map((item) => {
            const [id, itemLabel, active] = item.split('|');
            return {
              id: id ?? '',
              label: itemLabel ?? '',
              active: active === 'true',
              href: navHref(id ?? ''),
            };
          })
          .filter((item) => !hiddenNavigationIds.has(item.id)),
      };
    });
}

function navHref(id: string) {
  switch (id) {
    case 'explore':
    case 'image-to-video':
    case 'video-extender':
    case 'image-generator':
      return '/text-to-video#studio-feed';
    case 'text-to-video':
      return '/text-to-video';
    case 'home':
      return '/';
    case 'blog':
      return '/blog';
    case 'upgrade':
      return '/pricing';
    default:
      return '/text-to-video';
  }
}

function videoRecords(
  key: 'proactiv.showcase.records' | 'proactiv.video.studio.records'
): ProactivVideoShowcaseCase[] {
  return m[key]()
    .split('\n')
    .filter(Boolean)
    .map((row) => {
      const [title, description, src, posterSrc, category] = row.split('||');
      return {
        category: category ?? '',
        title: title ?? '',
        description: description ?? '',
        src: src ?? '',
        posterSrc: posterSrc ?? '',
      };
    });
}

function studioCases(): ProactivVideoShowcaseCase[] {
  const homeCases = videoRecords('proactiv.showcase.records').slice(0, 20);
  const extraCases = videoRecords('proactiv.video.studio.records');

  const feedCases = homeCases.flatMap((homeCase, index) =>
    extraCases[index] ? [homeCase, extraCases[index]] : [homeCase]
  );

  // The studio feed is a visual reference surface, so repeat the complete
  // sequence to make the background wall twice as deep without introducing
  // unrelated stock footage.
  return [...feedCases, ...feedCases];
}

/** Localized content wiring for the immersive text-to-video workspace. */
export function TextToVideo({
  initialPrompt,
  workspaceIntro,
  showTemplateFeed = true,
}: {
  initialPrompt?: string;
  workspaceIntro?: ReactNode;
  showTemplateFeed?: boolean;
}) {
  const cases = studioCases();

  return (
    <SenziaAppShell
      brand={envConfigs.app_name}
      brandHref="/"
      languageLabel={m['proactiv.video.language']()}
      pricingLabel={m['landing.pricing.title']()}
      pricingHref="/pricing"
      collapseSidebarLabel={m['proactiv.sidebar.collapse']()}
      expandSidebarLabel={m['proactiv.sidebar.expand']()}
      navGroups={navGroups()}
    >
      <ProactivVideoStudio
        cases={cases}
        initialPrompt={initialPrompt}
        workspaceIntro={workspaceIntro}
        showTemplateFeed={showTemplateFeed}
        videoModelEnabled
        composerLabels={{
          addReference: m['proactiv.hero.composer.add_reference'](),
          firstFrame: m['proactiv.hero.composer.first_frame'](),
          lastFrame: m['proactiv.hero.composer.last_frame'](),
          aspectRatio: m['proactiv.hero.composer.aspect_ratio'](),
          avatar: m['proactiv.hero.composer.avatar'](),
          duration: m['proactiv.hero.composer.duration'](),
          durationLoading: m['proactiv.hero.composer.duration_loading'](),
          durationPending: m['proactiv.hero.composer.duration_pending'](),
          durationUnavailable:
            m['proactiv.hero.composer.duration_unavailable'](),
          durationUnsupported:
            m['proactiv.hero.composer.duration_unsupported'](),
          generate: m['proactiv.hero.composer.generate'](),
          generated: m['proactiv.hero.composer.generated'](),
          image: m['proactiv.hero.composer.image'](),
          imageModel: m['proactiv.hero.composer.image_model'](),
          model: m['proactiv.hero.composer.model'](),
          placeholder: m['proactiv.hero.composer.placeholder'](),
          product: m['proactiv.hero.composer.product'](),
          removeAttachment: m['proactiv.hero.composer.remove_attachment'](),
          resolution: m['proactiv.hero.composer.resolution'](),
          textModel: m['proactiv.hero.composer.text_model'](),
          video: m['proactiv.hero.composer.video'](),
          videoModel: m['proactiv.hero.composer.video_model'](),
        }}
        copy={{
          activeTemplateLabel: m['proactiv.video.studio.active_template'](),
          clipCountLabel: m['proactiv.video.studio.clip_count']({
            count: cases.length,
          }),
          collapseComposerLabel: m['proactiv.video.studio.collapse_composer'](),
          liveLabel: m['proactiv.video.studio.live'](),
          readyLabel: m['proactiv.video.studio.ready'](),
          referenceImageLabel: m['proactiv.video.studio.reference_image'](),
          referenceVideoLabel: m['proactiv.video.studio.reference_video'](),
          generatedVideoLabel: m['proactiv.video.studio.generated_video'](),
          generatedImageLabel: m['proactiv.video.studio.generated_image'](),
          promptLabel: m['proactiv.video.studio.prompt'](),
          imagePreviewEmptyLabel:
            m['proactiv.video.studio.image_preview_empty'](),
          imagePreviewTitleLabel: m['proactiv.video.studio.image_preview'](),
          editPromptLabel: m['proactiv.video.studio.edit_prompt'](),
          regenerateLabel: m['proactiv.video.studio.regenerate'](),
          useAsReferenceLabel: m['proactiv.video.studio.use_as_reference'](),
          insufficientCreditsMessage:
            m['proactiv.video.studio.insufficient_credits'](),
          creditPaywallTitle: m['proactiv.video.studio.credit_paywall.title'](),
          creditPaywallDescription:
            m['proactiv.video.studio.credit_paywall.description'](),
          creditPackOptions: [
            {
              productId: h3MaxRetailPlans.essentials.monthly.productId,
              price: h3MaxRetailPlans.essentials.monthly.priceInCents / 100,
              planName: m['landing.pricing.essentials'](),
              creditsLabel: m['landing.pricing.feature_credits']({
                credits:
                  h3MaxRetailPlans.essentials.monthly.credits.toLocaleString(
                    'en-US'
                  ),
              }),
              intervalLabel:
                m['proactiv.video.studio.credit_paywall.per_month'](),
            },
            {
              productId: h3MaxRetailPlans.studio.monthly.productId,
              price: h3MaxRetailPlans.studio.monthly.priceInCents / 100,
              planName: m['landing.pricing.studio'](),
              creditsLabel: m['landing.pricing.feature_credits']({
                credits:
                  h3MaxRetailPlans.studio.monthly.credits.toLocaleString(
                    'en-US'
                  ),
              }),
              intervalLabel:
                m['proactiv.video.studio.credit_paywall.per_month'](),
              badgeLabel: m['proactiv.video.studio.credit_paywall.popular'](),
            },
            {
              productId: h3MaxRetailPlans.production.monthly.productId,
              price: h3MaxRetailPlans.production.monthly.priceInCents / 100,
              planName: m['landing.pricing.production'](),
              creditsLabel: m['landing.pricing.feature_credits']({
                credits:
                  h3MaxRetailPlans.production.monthly.credits.toLocaleString(
                    'en-US'
                  ),
              }),
              intervalLabel:
                m['proactiv.video.studio.credit_paywall.per_month'](),
            },
          ],
          checkoutFailedMessage:
            m['proactiv.video.studio.credit_paywall.checkout_failed'](),
          downloadVideoLabel: m['proactiv.video.studio.download_video'](),
          downloadImageLabel: m['proactiv.video.studio.download_image'](),
          openGeneratedVideoLabel:
            m['proactiv.video.studio.open_generated_video'](),
          openGeneratedImageLabel:
            m['proactiv.video.studio.open_generated_image'](),
          resultExpirationLabel: m['proactiv.video.studio.result_expiration'](),
          resultSavedLabel: m['proactiv.video.studio.result_saved'](),
          dismissGeneratedVideoLabel:
            m['proactiv.video.studio.dismiss_generated_video'](),
          dismissGeneratedImageLabel:
            m['proactiv.video.studio.dismiss_generated_image'](),
          uploadsRequiredMessage: m['proactiv.video.studio.uploads_required'](),
          imageUploadsRequiredMessage:
            m['proactiv.video.studio.image_uploads_required'](),
          uploadInProgressLabel: m['proactiv.video.studio.uploading'](),
          taskPendingLabel: m['proactiv.video.studio.task_pending'](),
          taskProcessingLabel: m['proactiv.video.studio.task_processing'](),
          taskCompletedLabel: m['proactiv.video.studio.task_completed'](),
          taskFailedLabel: m['proactiv.video.studio.task_failed'](),
          videoUnavailableMessage:
            m['proactiv.video.studio.video_unavailable'](),
          imageTaskPendingLabel:
            m['proactiv.video.studio.image_task_pending'](),
          imageTaskProcessingLabel:
            m['proactiv.video.studio.image_task_processing'](),
          imageTaskCompletedLabel:
            m['proactiv.video.studio.image_task_completed'](),
          imageTaskFailedLabel: m['proactiv.video.studio.image_task_failed'](),
          retryGenerationLabel: m['proactiv.video.studio.retry_generation'](),
          selectTemplateLabel: m['proactiv.video.studio.select_template'](),
        }}
      />
    </SenziaAppShell>
  );
}
