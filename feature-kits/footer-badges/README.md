# Footer badges feature kit

This kit adds an admin page where an administrator can paste badge embed code,
save it, and have the badge appear in the site footer without another deploy.
It is designed for projects with the same ShipAny/TanStack Start structure.

## Install into another ShipAny project

Copy the `feature-kits/footer-badges` folder into the target project's
`feature-kits/footer-badges` directory, then run this command from the target
project root:

```bash
node feature-kits/footer-badges/install.mjs .
```

The installer carries its own runtime templates. It copies the feature-owned files, adds the admin navigation item,
allows the public config key, mounts the badge list in `SiteFooter`, and adds
English/Chinese translations. Public badge reads go directly to the database,
so the shared one-hour config cache does not delay changes across server
instances. It checks the expected ShipAny files and refuses
to overwrite conflicting feature files. The target project's default badge
list starts empty.

Then run `pnpm build` in the target project. No schema or database migration is
needed; the saved list uses the existing `config` table. Open
`/admin/footer-badges` to manage badges. Custom footer implementations can
render `<FooterBadgeList />` from `@/components/footer-badge-list` wherever the
badges should appear.

## Accepted embed code

Paste one or more snippets shaped like this:

```html
<a href="https://example.com" target="_blank">
  <img src="https://example.com/badge.svg" width="250" alt="Featured badge" />
</a>
```

Only anchors containing a single image are accepted. Both URLs must use HTTPS,
and event handlers, scripts, styles, and arbitrary HTML are rejected. The app
extracts the link and image attributes and renders its own safe React markup;
the pasted HTML is never injected into the page. Up to 20 badges can be stored.

## Current project default

The reelslaunch project keeps its existing Fazier badge as a default until the
admin saves a badge list. The installer uses an empty default for other
projects, so it does not copy reelslaunch-specific links into them.
