# Site footer integration

In the target footer component, add:

```tsx
import { FooterBadgeList } from '@/components/footer-badge-list';
```

Render where badges should appear:

```tsx
<FooterBadgeList className="mt-6" />
```

Remove or retain any existing hardcoded badges as desired; if retained, they display alongside the admin-managed badges.
