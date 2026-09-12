import { envConfigs } from '@/config';
import { SITE_URL } from '@/lib/h3-seo';

export { SITE_URL };

export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL}/proactiv/showcase-videos/neon-dancer.jpg`;
export const TEXT_TO_VIDEO_SOCIAL_IMAGE_URL = `${SITE_URL}/logo.png`;

export const siteSeo = {
  home: {
    title: 'h3price ai - AI Video Generation Platform',
    description:
      'Create cinematic AI video from your ideas with h3price ai. Explore modern video generation workflows built for fast creative direction.',
    path: '/',
  },
  textToVideo: {
    title: `H3 Max Text to Video Generator | ${envConfigs.app_name}`,
    description:
      'Turn a text prompt into a cinematic H3 Max clip: pick the aspect ratio, resolution and duration, then generate. Free to try, no signup required.',
    path: '/text-to-video',
  },
} as const;
