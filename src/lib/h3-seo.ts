import { envConfigs } from '@/config';

export const SITE_URL = new URL(envConfigs.site_url).origin;
