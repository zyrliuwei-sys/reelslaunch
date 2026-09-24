# 可复制功能包：管理后台外链徽章

这份文件整理了当前项目的“后台粘贴徽章代码 → 安全解析与保存 → 网站页脚展示”功能。目标项目使用 TanStack Start、React、TanStack Query，并有类似的管理员鉴权和配置表时，可以按下面的路径复制代码；把每个代码块保存为标题标出的路径，再按“接入改动”合并少量现有文件。

当前后台地址是 `/admin/footer-badges`。粘贴的内容只允许一个或多个 `<a><img></a>` 徽章片段，链接和图片地址必须是 HTTPS；代码不会作为 HTML 执行。最多保存 20 个徽章，删除最后一个后，页脚不显示任何徽章。

## 复制前先确认

- 目标项目已有一个可存键值配置的 `config` 表（唯一键 `name`，值 `value`）。此功能不新增数据库字段。
- 目标项目已有管理员会话鉴权及 `admin.settings.read`、`admin.settings.write` 权限；若权限名不同，修改 API 文件里的权限字符串。
- 目标项目有 `@tanstack/react-query`、TanStack Start、`@/lib/api-client`、`@/lib/resp`，以及 shadcn `button`、`card`、`textarea`。没有这些组件时，替换页面 UI 即可，数据流不变。
- `defaults.ts` 目前含有本项目的 Fazier 默认徽章链接。复制前请换成目标项目自己的徽章，或改成空数组 `[]`。

## 文件 1：徽章类型

保存为 `src/features/footer-badges/types.ts`。

```ts
export interface FooterBadge {
  href: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const MAX_FOOTER_BADGES = 20;
```

## 文件：服务端与前端共用的校验

保存为 `src/features/footer-badges/validation.ts`。

```ts
import { MAX_FOOTER_BADGES, type FooterBadge } from './types';

const MAX_ALT_LENGTH = 120;

function safeHttpsUrl(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length > 2048) {
    throw new Error(`${field} must be an HTTPS URL`);
  }

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(`${field} must be an HTTPS URL`);
  }

  if (
    url.protocol !== 'https:' ||
    !url.hostname ||
    url.username.length > 0 ||
    url.password.length > 0
  ) {
    throw new Error(`${field} must be an HTTPS URL`);
  }

  return url.toString();
}

function optionalDimension(value: unknown, field: string, max: number) {
  if (value === undefined || value === null || value === '') return undefined;
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(number) || number < 1 || number > max) {
    throw new Error(
      `${field} must be a positive integer no greater than ${max}`
    );
  }
  return number;
}

export function validateFooterBadges(value: unknown): FooterBadge[] {
  if (!Array.isArray(value) || value.length > MAX_FOOTER_BADGES) {
    throw new Error(
      `A maximum of ${MAX_FOOTER_BADGES} footer badges is allowed`
    );
  }

  return value.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Footer badge ${index + 1} is invalid`);
    }

    const badge = item as Record<string, unknown>;
    const href = safeHttpsUrl(badge.href, `Badge ${index + 1} link`);
    const src = safeHttpsUrl(badge.src, `Badge ${index + 1} image`);
    const alt = typeof badge.alt === 'string' ? badge.alt.trim() : '';

    if (!alt || alt.length > MAX_ALT_LENGTH) {
      throw new Error(
        `Badge ${index + 1} alt text must be 1-${MAX_ALT_LENGTH} characters`
      );
    }

    return {
      href,
      src,
      alt,
      width: optionalDimension(badge.width, `Badge ${index + 1} width`, 1000),
      height: optionalDimension(badge.height, `Badge ${index + 1} height`, 600),
    };
  });
}

export function parseStoredFooterBadges(value?: string): FooterBadge[] {
  if (!value) return [];
  try {
    return validateFooterBadges(JSON.parse(value));
  } catch {
    return [];
  }
}
```

## 文件：安全解析粘贴的 HTML 片段

保存为 `src/features/footer-badges/markup.ts`。

```ts
import type { FooterBadge } from './types';
import { validateFooterBadges } from './validation';

const ANCHOR_ATTRIBUTES = new Set(['href', 'target', 'rel']);
const IMAGE_ATTRIBUTES = new Set(['src', 'alt', 'width', 'height', 'loading']);

function hasOnlyAllowedAttributes(element: Element, allowed: Set<string>) {
  return Array.from(element.attributes).every((attribute) =>
    allowed.has(attribute.name.toLowerCase())
  );
}

function hasOnlyWhitespaceText(element: Element) {
  return Array.from(element.childNodes).every(
    (node) => node.nodeType === Node.ELEMENT_NODE || !node.textContent?.trim()
  );
}

/**
 * Extract safe link/image data from pasted badge snippets without rendering
 * submitted HTML. Only <a><img></a> markup and a small attribute allowlist are
 * accepted; the server validates the extracted values again before saving.
 */
export function parseFooterBadgeMarkup(markup: string): FooterBadge[] {
  if (!markup.trim() || markup.length > 20_000) {
    throw new Error('invalid_markup');
  }

  const doc = new DOMParser().parseFromString(markup, 'text/html');
  const elements = Array.from(doc.body.children);
  if (
    elements.length === 0 ||
    !hasOnlyWhitespaceText(doc.body) ||
    elements.some((element) => element.tagName !== 'A')
  ) {
    throw new Error('invalid_markup');
  }

  const badges = elements.map((anchor) => {
    if (
      !hasOnlyAllowedAttributes(anchor, ANCHOR_ATTRIBUTES) ||
      (anchor.getAttribute('target') &&
        anchor.getAttribute('target') !== '_blank') ||
      !hasOnlyWhitespaceText(anchor)
    ) {
      throw new Error('invalid_markup');
    }

    const children = Array.from(anchor.children);
    if (children.length !== 1 || children[0]?.tagName !== 'IMG') {
      throw new Error('invalid_markup');
    }

    const image = children[0];
    if (!hasOnlyAllowedAttributes(image, IMAGE_ATTRIBUTES)) {
      throw new Error('invalid_markup');
    }

    return {
      href: anchor.getAttribute('href') ?? '',
      src: image.getAttribute('src') ?? '',
      alt: image.getAttribute('alt') ?? '',
      width: image.hasAttribute('width')
        ? Number(image.getAttribute('width'))
        : 250,
      height: image.hasAttribute('height')
        ? Number(image.getAttribute('height'))
        : undefined,
    };
  });

  return validateFooterBadges(badges);
}
```

## 文件：未保存设置时的默认徽章

保存为 `src/features/footer-badges/defaults.ts`。

```ts
import type { FooterBadge } from './types';

/** Keeps the existing launch badge visible until an admin saves a badge list. */
export const DEFAULT_FOOTER_BADGES: FooterBadge[] = [
  {
    href: 'https://fazier.com/launches/www.reelslaunch.com',
    src: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark',
    alt: 'Fazier badge',
    width: 250,
  },
];
```

## 文件：从 config 表读取和保存

保存为 `src/modules/footer-badges/service.ts`。

```ts
import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { config } from '@/config/db/schema';

const CONFIG_KEY = 'footer_badges';

/** Read directly so separate server instances cannot serve stale config cache data. */
export async function getStoredFooterBadges(): Promise<string | undefined> {
  const [row] = await db()
    .select({ value: config.value })
    .from(config)
    .where(eq(config.name, CONFIG_KEY))
    .limit(1);

  return row?.value ?? undefined;
}

/** Store the validated badge list in the shared config table. */
export async function saveStoredFooterBadges(value: string): Promise<void> {
  await db().transaction(async (tx: any) => {
    const [existing] = await tx
      .select({ name: config.name })
      .from(config)
      .where(eq(config.name, CONFIG_KEY))
      .limit(1);

    if (existing) {
      await tx.update(config).set({ value }).where(eq(config.name, CONFIG_KEY));
    } else {
      await tx.insert(config).values({ name: CONFIG_KEY, value });
    }
  });
}
```

## 文件：受管理员权限保护的 API

保存为 `src/routes/api/admin/footer-badges.ts`。

```ts
import { createFileRoute } from '@tanstack/react-router';
import { DEFAULT_FOOTER_BADGES } from '@/features/footer-badges/defaults';
import {
  parseStoredFooterBadges,
  validateFooterBadges,
} from '@/features/footer-badges/validation';

import { getAuth } from '@/core/auth';
import {
  getStoredFooterBadges,
  saveStoredFooterBadges,
} from '@/modules/footer-badges/service';
import { hasPermission } from '@/modules/rbac/service';
import { respData, respErr } from '@/lib/resp';

const noStore = {
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  },
};

async function checkPermission(request: Request, permission: string) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Error('Unauthorized');

  const allowed = await hasPermission(session.user.id, permission);
  if (!allowed) throw new Error('Forbidden');
}

async function GET({ request }: { request: Request }) {
  try {
    await checkPermission(request, 'admin.settings.read');
    const stored = await getStoredFooterBadges();
    return respData(
      stored === undefined
        ? DEFAULT_FOOTER_BADGES
        : parseStoredFooterBadges(stored),
      noStore
    );
  } catch (error) {
    return respErr(error instanceof Error ? error.message : 'Internal error');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    await checkPermission(request, 'admin.settings.write');
    const body = await request.json();
    if (!body || typeof body !== 'object' || !('badges' in body)) {
      return respErr('Invalid footer badges payload');
    }

    const badges = validateFooterBadges(body.badges);
    await saveStoredFooterBadges(JSON.stringify(badges));
    return respData(badges, noStore);
  } catch (error) {
    return respErr(error instanceof Error ? error.message : 'Internal error');
  }
}

export const Route = createFileRoute('/api/admin/footer-badges')({
  server: { handlers: { GET, POST } },
});
```

## 文件：后台管理页面

保存为 `src/routes/admin/footer-badges.tsx`。

```tsx
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { parseFooterBadgeMarkup } from '@/features/footer-badges/markup';
import {
  MAX_FOOTER_BADGES,
  type FooterBadge,
} from '@/features/footer-badges/types';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { apiGet, apiPost } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const queryKey = ['admin-footer-badges'];

function AdminFooterBadgesPage() {
  const queryClient = useQueryClient();
  const [markup, setMarkup] = useState('');
  const [inputError, setInputError] = useState(false);
  const {
    data: badges = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => apiGet<FooterBadge[]>('/api/admin/footer-badges'),
  });

  const saveMutation = useMutation({
    mutationFn: (nextBadges: FooterBadge[]) =>
      apiPost<FooterBadge[]>('/api/admin/footer-badges', {
        badges: nextBadges,
      }),
    onSuccess: (savedBadges) => {
      queryClient.setQueryData(queryKey, savedBadges);
      queryClient.invalidateQueries({ queryKey: ['public-config'] });
      toast.success(m['admin.footer_badges.saved']());
      setMarkup('');
      setInputError(false);
    },
    onError: () => toast.error(m['admin.footer_badges.save_error']()),
  });

  useEffect(() => {
    if (isError) toast.error(m['admin.footer_badges.load_error']());
  }, [isError]);

  function addBadge() {
    setInputError(false);
    try {
      const parsed = parseFooterBadgeMarkup(markup);
      if (badges.length + parsed.length > MAX_FOOTER_BADGES) {
        setInputError(true);
        return;
      }
      saveMutation.mutate([...badges, ...parsed]);
    } catch {
      setInputError(true);
    }
  }

  function removeBadge(index: number) {
    saveMutation.mutate(badges.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {m['admin.footer_badges.title']()}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {m['admin.footer_badges.description']()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{m['admin.footer_badges.add_title']()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label htmlFor="footer-badge-markup" className="text-sm font-medium">
            {m['admin.footer_badges.code_label']()}
          </label>
          <Textarea
            id="footer-badge-markup"
            value={markup}
            onChange={(event) => {
              setMarkup(event.target.value);
              setInputError(false);
            }}
            placeholder={m['admin.footer_badges.code_placeholder']()}
            rows={6}
            aria-invalid={inputError}
            aria-describedby="footer-badge-help"
            className="font-mono text-xs"
            disabled={saveMutation.isPending}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              id="footer-badge-help"
              className={
                inputError
                  ? 'text-destructive text-sm'
                  : 'text-muted-foreground text-sm'
              }
            >
              {inputError
                ? m['admin.footer_badges.invalid_code']()
                : m['admin.footer_badges.code_help']({
                    max: MAX_FOOTER_BADGES,
                  })}
            </p>
            <Button
              type="button"
              onClick={addBadge}
              disabled={saveMutation.isPending || isLoading}
            >
              {saveMutation.isPending ? (
                m['admin.footer_badges.adding']()
              ) : (
                <>
                  <Plus data-icon="inline-start" />
                  {m['admin.footer_badges.add_button']()}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{m['admin.footer_badges.current_title']()}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">
              {m['admin.footer_badges.loading']()}
            </p>
          ) : badges.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {m['admin.footer_badges.empty']()}
            </p>
          ) : (
            <ul className="space-y-3">
              {badges.map((badge, index) => (
                <li
                  key={`${badge.href}:${badge.src}`}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex min-h-12 items-center">
                      <img
                        src={badge.src}
                        alt={badge.alt}
                        width={badge.width ?? 250}
                        height={badge.height}
                        className="h-auto max-h-16 max-w-full"
                      />
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {badge.href}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saveMutation.isPending}
                    onClick={() => removeBadge(index)}
                    aria-label={m['admin.footer_badges.remove']()}
                  >
                    <Trash2 data-icon="inline-start" />
                    {m['admin.footer_badges.remove']()}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/admin/footer-badges')({
  component: AdminFooterBadgesPage,
});
```

## 文件：网站页脚的动态徽章列表

保存为 `src/components/footer-badge-list.tsx`。

```tsx
import { DEFAULT_FOOTER_BADGES } from '@/features/footer-badges/defaults';
import { parseStoredFooterBadges } from '@/features/footer-badges/validation';

import { cn } from '@/lib/utils';
import { usePublicConfig } from '@/hooks/use-public-config';

export function FooterBadgeList({ className }: { className?: string }) {
  const { data } = usePublicConfig();
  const badges =
    data?.footer_badges === undefined
      ? DEFAULT_FOOTER_BADGES
      : parseStoredFooterBadges(data.footer_badges);

  if (badges.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {badges.map((badge) => (
        <a
          key={`${badge.href}:${badge.src}`}
          href={badge.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full transition-opacity hover:opacity-80"
        >
          <img
            src={badge.src}
            alt={badge.alt}
            width={badge.width ?? 250}
            height={badge.height}
            loading="lazy"
            className="h-auto max-w-full"
          />
        </a>
      ))}
    </div>
  );
}
```

## 接入改动 A：公开配置接口

在目标项目的 `src/routes/api/config/public.ts` 合并以下三处。不要用这段代码覆盖整个文件，因为该接口通常还负责公开其他应用配置。

1. 添加导入：

```ts
import { getStoredFooterBadges } from '@/modules/footer-badges/service';
```

2. 把 `footer_badges` 加入允许公开返回的键列表：

```ts
const publicKeys = [
  // 保留目标项目已有的键……
  'footer_badges',
];
```

3. 在 GET handler 中与配置并行读取；过滤后把徽章值放回结果。未保存过时删除此字段，让前端使用 `defaults.ts`：

```ts
const [configs, storedFooterBadges] = await Promise.all([
  getAllConfigs(),
  getStoredFooterBadges(),
]);
const result = filterPublicConfigs(configs, publicKeys);
if (storedFooterBadges === undefined) delete result.footer_badges;
else result.footer_badges = storedFooterBadges;
```

如果目标项目没有现成的 `usePublicConfig()`，让页脚组件通过目标项目的公开配置查询读取 `/api/config/public`，并让它把 `footer_badges` 作为字符串返回。保存成功后需刷新该查询缓存。

## 接入改动 B：后台导航

在 `src/routes/admin/route.tsx` 的导航图标导入里加 `BadgeCheck`，并在后台底部导航数组里加一项。项目已有更合适的导航分组时，也可以放到对应分组：

```tsx
{
  href: '/admin/footer-badges',
  label: m['admin.nav.footer_badges'](),
  icon: BadgeCheck,
},
```

路由文件使用 `createFileRoute('/admin/footer-badges')`，TanStack Start 会自动生成路由树；不要手动编辑生成文件。

## 接入改动 C：在网站页脚展示

在目标项目页脚组件导入并渲染动态徽章列表：

```tsx
import { FooterBadgeList } from '@/components/footer-badge-list';
```

把它放在页脚希望展示徽章的位置，例如：

```tsx
<FooterBadgeList className="mt-6" />
```

如果目标项目的页脚还传入硬编码徽章，管理页中的徽章会与它们同时显示。要让管理页完全控制徽章列表，请移除原来的硬编码徽章渲染或数据。

## 接入改动 D：中英文文案

把下面的键分别并入 `messages/en.json` 与 `messages/zh.json`，然后按目标项目流程重新生成 Paraglide 消息。若目标项目不用 Paraglide，可直接把这些字符串替换进页面组件。

`messages/en.json`：

```json
{
  "admin.nav.footer_badges": "Footer badges",
  "admin.footer_badges.title": "Footer badges",
  "admin.footer_badges.description": "Manage the badge links shown in your site footer.",
  "admin.footer_badges.add_title": "Add a badge",
  "admin.footer_badges.code_label": "Badge embed code",
  "admin.footer_badges.code_placeholder": "<a href=\"https://example.com\" target=\"_blank\"><img src=\"https://example.com/badge.svg\" width=250 alt=\"Featured badge\" /></a>",
  "admin.footer_badges.code_help": "Paste one or more anchor/image badges. Only HTTPS links and images are accepted; up to {max} badges can be shown.",
  "admin.footer_badges.invalid_code": "That code is not supported. Paste only an <a> containing one <img> with HTTPS URLs.",
  "admin.footer_badges.add_button": "Add to footer",
  "admin.footer_badges.adding": "Adding...",
  "admin.footer_badges.current_title": "Visible badges",
  "admin.footer_badges.empty": "No badges have been added yet.",
  "admin.footer_badges.loading": "Loading badges...",
  "admin.footer_badges.load_error": "Could not load footer badges.",
  "admin.footer_badges.remove": "Remove",
  "admin.footer_badges.saved": "Footer badge updated.",
  "admin.footer_badges.save_error": "Could not update the footer badge."
}
```

`messages/zh.json`：

```json
{
  "admin.nav.footer_badges": "页脚徽章",
  "admin.footer_badges.title": "页脚徽章",
  "admin.footer_badges.description": "管理网站页脚中展示的徽章链接。",
  "admin.footer_badges.add_title": "添加徽章",
  "admin.footer_badges.code_label": "徽章嵌入代码",
  "admin.footer_badges.code_placeholder": "<a href=\"https://example.com\" target=\"_blank\"><img src=\"https://example.com/badge.svg\" width=250 alt=\"Featured badge\" /></a>",
  "admin.footer_badges.code_help": "粘贴一个或多个链接/图片徽章代码。仅接受 HTTPS 链接和图片，最多展示 {max} 个徽章。",
  "admin.footer_badges.invalid_code": "代码格式不支持。请只粘贴包含一个 <img> 的 <a> 标签，并使用 HTTPS 地址。",
  "admin.footer_badges.add_button": "添加到页脚",
  "admin.footer_badges.adding": "添加中...",
  "admin.footer_badges.current_title": "当前展示的徽章",
  "admin.footer_badges.empty": "还没有添加徽章。",
  "admin.footer_badges.loading": "正在加载徽章...",
  "admin.footer_badges.load_error": "无法加载页脚徽章。",
  "admin.footer_badges.remove": "移除",
  "admin.footer_badges.saved": "页脚徽章已更新。",
  "admin.footer_badges.save_error": "无法更新页脚徽章。"
}
```

## 搬过去后的检查

1. 修改 `defaults.ts` 中的默认徽章链接，或设为 `[]`。
2. 确认路由生成后 `/admin/footer-badges` 可打开，菜单权限能访问。
3. 粘贴 HTTPS 的 `<a><img></a>` 代码，保存后确认页脚展示；再移除后确认不再展示。
4. 运行目标项目的构建命令，确认类型、消息键和路由都通过。
