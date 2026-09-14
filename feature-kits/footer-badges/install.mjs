#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const kitDir = dirname(fileURLToPath(import.meta.url));
const filesRoot = resolve(kitDir, 'files');
const targetArg = process.argv[2];

if (!targetArg || targetArg === '--help' || targetArg === '-h') {
  console.error(
    'Usage: node feature-kits/footer-badges/install.mjs <path-to-ShipAny-project>'
  );
  process.exit(1);
}

const targetRoot = resolve(process.cwd(), targetArg);

const copyMappings = [
  [
    'src/features/footer-badges/types.ts',
    'src/features/footer-badges/types.ts',
  ],
  [
    'src/features/footer-badges/validation.ts',
    'src/features/footer-badges/validation.ts',
  ],
  [
    'src/features/footer-badges/markup.ts',
    'src/features/footer-badges/markup.ts',
  ],
  [
    'src/modules/footer-badges/service.ts',
    'src/modules/footer-badges/service.ts',
  ],
  [
    'src/features/footer-badges/defaults.ts',
    'src/features/footer-badges/defaults.ts',
  ],
  [
    'src/components/footer-badge-list.tsx',
    'src/components/footer-badge-list.tsx',
  ],
  ['src/routes/admin/footer-badges.tsx', 'src/routes/admin/footer-badges.tsx'],
  [
    'src/routes/api/admin/footer-badges.ts',
    'src/routes/api/admin/footer-badges.ts',
  ],
];

const messages = {
  en: {
    'admin.nav.footer_badges': 'Footer badges',
    'admin.footer_badges.title': 'Footer badges',
    'admin.footer_badges.description':
      'Manage the badge links shown in your site footer.',
    'admin.footer_badges.add_title': 'Add a badge',
    'admin.footer_badges.code_label': 'Badge embed code',
    'admin.footer_badges.code_placeholder':
      '<a href="https://example.com" target="_blank"><img src="https://example.com/badge.svg" width=250 alt="Featured badge" /></a>',
    'admin.footer_badges.code_help':
      'Paste one or more anchor/image badges. Only HTTPS links and images are accepted; up to {max} badges can be shown.',
    'admin.footer_badges.invalid_code':
      'That code is not supported. Paste only an <a> containing one <img> with HTTPS URLs.',
    'admin.footer_badges.add_button': 'Add to footer',
    'admin.footer_badges.adding': 'Adding...',
    'admin.footer_badges.current_title': 'Visible badges',
    'admin.footer_badges.empty': 'No badges have been added yet.',
    'admin.footer_badges.loading': 'Loading badges...',
    'admin.footer_badges.load_error': 'Could not load footer badges.',
    'admin.footer_badges.remove': 'Remove',
    'admin.footer_badges.saved': 'Footer badge updated.',
    'admin.footer_badges.save_error': 'Could not update the footer badge.',
  },
  zh: {
    'admin.nav.footer_badges': '页脚徽章',
    'admin.footer_badges.title': '页脚徽章',
    'admin.footer_badges.description': '管理网站页脚中展示的徽章链接。',
    'admin.footer_badges.add_title': '添加徽章',
    'admin.footer_badges.code_label': '徽章嵌入代码',
    'admin.footer_badges.code_placeholder':
      '<a href="https://example.com" target="_blank"><img src="https://example.com/badge.svg" width=250 alt="Featured badge" /></a>',
    'admin.footer_badges.code_help':
      '粘贴一个或多个链接/图片徽章代码。仅接受 HTTPS 链接和图片，最多展示 {max} 个徽章。',
    'admin.footer_badges.invalid_code':
      '代码格式不支持。请只粘贴包含一个 <img> 的 <a> 标签，并使用 HTTPS 地址。',
    'admin.footer_badges.add_button': '添加到页脚',
    'admin.footer_badges.adding': '添加中...',
    'admin.footer_badges.current_title': '当前展示的徽章',
    'admin.footer_badges.empty': '还没有添加徽章。',
    'admin.footer_badges.loading': '正在加载徽章...',
    'admin.footer_badges.load_error': '无法加载页脚徽章。',
    'admin.footer_badges.remove': '移除',
    'admin.footer_badges.saved': '页脚徽章已更新。',
    'admin.footer_badges.save_error': '无法更新页脚徽章。',
  },
};

async function readTarget(relativePath) {
  try {
    return await readFile(resolve(targetRoot, relativePath), 'utf8');
  } catch {
    throw new Error(`Required ShipAny file not found: ${relativePath}`);
  }
}

const writes = new Map();

function schedule(relativePath, content) {
  writes.set(relativePath, content);
}

async function scheduleCopy(sourcePath, targetPath) {
  const content = await readFile(resolve(filesRoot, sourcePath), 'utf8');
  let existing;
  try {
    existing = await readFile(resolve(targetRoot, targetPath), 'utf8');
  } catch {
    // New feature file.
  }
  if (existing !== undefined && existing !== content) {
    throw new Error(
      `Refusing to overwrite a different file: ${targetPath}. Back it up and merge manually.`
    );
  }
  schedule(targetPath, content);
}

async function patchPublicConfig() {
  const path = 'src/routes/api/config/public.ts';
  let content = await readTarget(path);
  if (!content.includes("  'footer_badges',")) {
    const marker = "  'plausible_src',";
    if (!content.includes(marker)) {
      throw new Error(
        `Could not find the public config insertion point in ${path}`
      );
    }
    content = content.replace(marker, `${marker}\n  'footer_badges',`);
  }

  const configImport =
    "import { filterPublicConfigs, getAllConfigs } from '@/modules/config/service';";
  if (!content.includes("from '@/modules/footer-badges/service'")) {
    if (!content.includes(configImport)) {
      throw new Error(`Could not find the config imports in ${path}`);
    }
    content = content.replace(
      configImport,
      `${configImport}\nimport { getStoredFooterBadges } from '@/modules/footer-badges/service';`
    );
  }

  const getConfigs = '  const configs = await getAllConfigs();';
  if (!content.includes('getStoredFooterBadges()')) {
    if (!content.includes(getConfigs)) {
      throw new Error(`Could not find the config loader in ${path}`);
    }
    content = content.replace(
      getConfigs,
      `  const [configs, storedFooterBadges] = await Promise.all([\n    getAllConfigs(),\n    getStoredFooterBadges(),\n  ]);`
    );
    const resultLine =
      '  const result = filterPublicConfigs(configs, publicKeys);';
    if (!content.includes(resultLine)) {
      throw new Error(`Could not find the public config filter in ${path}`);
    }
    content = content.replace(
      resultLine,
      `${resultLine}\n  if (storedFooterBadges === undefined) delete result.footer_badges;\n  else result.footer_badges = storedFooterBadges;`
    );
  }
  schedule(path, content);
}

async function patchAdminNavigation() {
  const path = 'src/routes/admin/route.tsx';
  let content = await readTarget(path);
  const iconImport = content.match(
    /import \{\n([\s\S]*?)\n\} from 'lucide-react';/
  );
  if (!iconImport) {
    throw new Error(`Could not find the lucide-react import in ${path}`);
  }
  if (
    !iconImport[1].split(/[,\n]/).some((name) => name.trim() === 'BadgeCheck')
  ) {
    content = content.replace(
      iconImport[0],
      `import {\n  BadgeCheck,\n${iconImport[1]}\n} from 'lucide-react';`
    );
  }

  const navStart = '  const footerNavItems = [\n';
  if (!content.includes(navStart)) {
    throw new Error(`Could not find the footer navigation in ${path}`);
  }
  if (!content.includes("href: '/admin/footer-badges'")) {
    content = content.replace(
      navStart,
      `${navStart}    {\n      href: '/admin/footer-badges',\n      label: m['admin.nav.footer_badges'](),\n      icon: BadgeCheck,\n    },\n`
    );
  }
  schedule(path, content);
}

async function patchSiteFooter() {
  const path = 'src/components/site-footer.tsx';
  let content = await readTarget(path);
  const importAnchor =
    "import { LocaleSelector } from '@/components/locale-selector';";
  if (!content.includes("from '@/components/footer-badge-list'")) {
    if (!content.includes(importAnchor)) {
      throw new Error(`Could not find the import insertion point in ${path}`);
    }
    content = content.replace(
      importAnchor,
      `import { FooterBadgeList } from '@/components/footer-badge-list';\n${importAnchor}`
    );
  }

  const renderAnchor = '            {socials && socials.length > 0 ? (';
  if (!content.includes('<FooterBadgeList')) {
    if (!content.includes(renderAnchor)) {
      throw new Error(
        `Could not find the badge render insertion point in ${path}`
      );
    }
    content = content.replace(
      renderAnchor,
      `            <FooterBadgeList className="mt-6" />\n${renderAnchor}`
    );
  }
  schedule(path, content);
}

async function patchMessages(locale) {
  const path = `messages/${locale}.json`;
  const content = await readTarget(path);
  const json = JSON.parse(content);
  for (const [key, value] of Object.entries(messages[locale])) {
    if (!(key in json)) json[key] = value;
  }
  schedule(path, `${JSON.stringify(json, null, 2)}\n`);
}

try {
  await readTarget('src/routes/admin/route.tsx');
  await readTarget('src/routes/api/config/public.ts');
  await readTarget('src/components/site-footer.tsx');
  await readTarget('messages/en.json');
  await readTarget('messages/zh.json');

  for (const [sourcePath, targetPath] of copyMappings) {
    await scheduleCopy(sourcePath, targetPath);
  }
  await patchPublicConfig();
  await patchAdminNavigation();
  await patchSiteFooter();
  await patchMessages('en');
  await patchMessages('zh');

  for (const [relativePath, content] of writes) {
    const path = resolve(targetRoot, relativePath);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }

  console.log(`Footer badges installed into ${targetRoot}`);
  console.log(
    'Next: run pnpm build in the target project, then open /admin/footer-badges.'
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
