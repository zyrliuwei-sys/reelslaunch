import type { ReelslaunchGenerationValues } from '@/components/reelslaunch/hero-composer';

// Keep local files across the landing page's client-side navigation.
let draft: ReelslaunchGenerationValues | undefined;

export function saveVideoComposerDraft(value: ReelslaunchGenerationValues) {
  draft = value;
}

export function takeVideoComposerDraft() {
  const value = draft;
  draft = undefined;
  return value;
}
