# Admin navigation integration

In `src/routes/admin/route.tsx`, import `BadgeCheck` from `lucide-react`, then add this entry to the existing `footerNavItems` array:

```tsx
{
  href: '/admin/footer-badges',
  label: m['admin.nav.footer_badges'](),
  icon: BadgeCheck,
},
```

If the target project has different permissions, update the permission names in `src/routes/api/admin/footer-badges.ts`. The route path is `/admin/footer-badges`.
