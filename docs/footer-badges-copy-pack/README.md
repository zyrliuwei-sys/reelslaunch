# 外链页脚徽章功能包

## 快速复制

1. 把此压缩包解压到目标项目根目录，保留 `src/` 目录结构。ZIP 中的文件都是新增文件。
2. 按 `integration/` 下三个 Markdown 文件的说明，把公共配置、后台导航、页脚展示片段合并到目标项目现有文件。不要用片段覆盖整个现有文件。
3. 把 `integration/messages-en.json` 与 `integration/messages-zh.json` 的键合并进目标项目对应语言文件。
4. 确认目标项目已有共享 `config` 表（`name`/`value`），并按需调整 API 中的登录鉴权、RBAC 权限名和路径别名。
5. `src/features/footer-badges/defaults.ts` 默认空列表。如果想让某些徽章在后台首次保存前就显示，可在这里填入目标项目自己的 HTTPS 徽章数据。
6. 构建并手动检查：访问 `/admin/footer-badges`，粘贴徽章代码、保存，再到网站页脚确认显示。

## 运行依赖

TanStack Start/Router、React、TanStack Query、lucide-react、sonner，项目自己的 `api-client`、`resp`、认证和 RBAC 模块，以及 shadcn `button`、`card`、`textarea` 组件。若目标项目组件或 API 约定不同，只需调整路由页和 API 包装，校验与存储逻辑可保留。

本包限制粘贴格式为 `<a><img></a>`、只接受 HTTPS URL，并在客户端解析后于服务端再次校验；不会执行用户粘贴的 HTML。
