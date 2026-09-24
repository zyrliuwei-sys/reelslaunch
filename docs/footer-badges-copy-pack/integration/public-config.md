# Public config integration

Merge these changes into `src/routes/api/config/public.ts`; do not replace the whole route.

Import:

```ts
import { getStoredFooterBadges } from '@/modules/footer-badges/service';
```

Add `'footer_badges'` to the existing `publicKeys` array. In the GET handler, load it along with existing config and attach it to the filtered response:

```ts
const [configs, storedFooterBadges] = await Promise.all([
  getAllConfigs(),
  getStoredFooterBadges(),
]);
const result = filterPublicConfigs(configs, publicKeys);
if (storedFooterBadges === undefined) delete result.footer_badges;
else result.footer_badges = storedFooterBadges;
```

Preserve the rest of the target project's handler. The footer component reads `footer_badges` from the existing public-config query.
