# AGENTS.md

面向 AI 编码代理的项目说明。本文件基于对仓库实际内容的梳理，更新日期 2026-09-05。

## 项目概述

**Paul的技术博客** —— 基于 [Hugo](https://gohugo.io/)（extended 版）+ **自研主题**的简体中文个人静态博客。内容从旧 Jekyll 博客（dkisser.github.io）迁移而来，共 19 篇文章 + `content/notes/` 数字花园笔记体系（stage/version/related 字段，双向引用）。

- 站点配置：`hugo.yaml`（单语言 zh-cn，`baseURL` 为 `https://dkisser.cn/`；单文件 + 注释分区组织）
- 主题自研、全部入库：2026-09 起弃用 Toha v4 / Hugo Modules，`layouts/` + `assets/` 即主题层，无外部主题依赖，**不再需要 Go**
- 视觉还原自 `stitch/` 目录的 Stitch 设计稿（已 gitignore 不入库），双主题：浅色 Architectural Light / 深色 Glacial Synapse
- 搜索使用 **Pagefind**（构建后索引 `public/pagefind/`）；搜索页 `layouts/_default/search.html` 中文界面，开发模式（hugo server）下无索引时会显示降级提示

## 设计稿与样式规范（改样式前必读）

仓库内有两份**色系样式规范**，是全站样式的唯一事实来源（single source of truth）：

| 文件 | 色系 | 规范名 |
| --- | --- | --- |
| `docs/style-guide-light.md` | 浅色（默认 `:root`） | Architectural Light |
| `docs/style-guide-dark.md` | 深色（`html.dark`） | Glacial Synapse |
| `docs/design-tokens-light.json` / `docs/design-tokens-dark.json` | 对应色系的 token 原始值 | — |

约定：

- **新增或修改任何组件样式前，先读对应色系的 style-guide**；两个色系都要顾及，新组件必须双主题可用。
- 颜色一律使用 `assets/css/main.src.css` 里的语义 token（`--color-bg` / `--color-card` / `--color-primary` / `--color-muted` 等，经 Tailwind `@theme inline` 映射为 `bg-bg`、`text-muted` 等工具类），**禁止硬编码色值**；透明度用 `color-mix`。
- 代码块深浅主题共用深底 `#090d16`（"Terminal Execution Block" 规范），Chroma 高亮仅一套冰蓝配色。
- `stitch/` 目录（本地 gitignore）存有设计稿 HTML/截图/screen.json，共 17 套方案；已采用的为 `01-home-light`、`03-garden-dark`（P2）、`05`/`06`（两份 style-guide 来源）、`08-article-agentic-loop-light` 等，需要对照视觉细节时查阅。

## 技术栈与版本

| 组件 | 版本 | 用途 |
| --- | --- | --- |
| Hugo extended | 0.165.0 | 静态站点生成（裸机要求 ≥ 0.163） |
| Node.js | ≥ 18（CI/Docker 用 22） | Tailwind CLI、Pagefind 及前端库 |
| Tailwind CSS | v4（`@tailwindcss/cli`，CSS-first，无 tailwind.config.js） | 全站样式 |

`package.json` 前端依赖（全部在用，勿删）：

- `@tailwindcss/cli` + `tailwindcss`：`assets/css/main.src.css` → `assets/css/main.css`（**生成物，已 gitignore**）
- `pagefind`：构建后全文索引
- `katex` / `mermaid`：文章 front matter `math: true` / `mermaid: true` 的页面按需加载（经 `hugo.yaml` mounts 挂载，mermaid 走 Pipes 指纹化）
- `typeit`：仅首页 hero 打字机（读 `data/author.yaml` 的 `summary` 轮播）
- `@fontsource/inter` / `@fontsource/jetbrains-mono`：自托管字体（mounts 到 `static/fonts/`）；Material Symbols 图标字体自托管在 `static/fonts/material-symbols.woff2`

注意：`hugo.yaml` 自定义了 `module.mounts`，会把 Hugo 默认挂载覆盖掉，必须显式补回 `static` 和 `assets`；前端库的单文件/目录挂载也都在该区。**改动 mounts 时保持这些条目完整**——这里是全站唯一引用 `node_modules` 的地方。

## 常用命令

```bash
# 本地开发
docker compose up --build      # 推荐：无需本地装 Hugo/Node，访问 http://localhost:1313
# 或裸机（两个进程，可开两个终端）：
npm run css:watch              # Tailwind watch：main.src.css → main.css
hugo server                    # 同端口 1313

# 构建（含 CSS 编译 + Pagefind 索引；与 CI 完全同命令）
npm run build                  # = bash scripts/build.sh = npm run css && hugo --minify --cleanDestinationDir && npx pagefind --site public

# 只编译一次 CSS
npm run css

# URL 校验（构建后验证 19 篇文章路径与旧站 URL 一致，应输出 19/19 命中）
npm run verify                 # = node scripts/verify_urls.js

# 部署
npm run deploy                 # = bash scripts/deploy.sh（构建 + rsync 推送，参数读项目根 .env）
bash scripts/deploy.sh --dry-run   # 只预览 rsync 变更
```

裸机环境最低要求：Hugo ≥ 0.163（extended）、Node ≥ 18。**不需要 Go**（无 Hugo Modules 依赖）。

## 目录结构

```
hugo.yaml            # 站点配置（单文件注释分区：站点级/markup/输出/taxonomy/related/mounts/params）
layouts/             # 主题层（模板）：_default/（baseof、about/archives/search、list 兜底、
                     #   taxonomy.html 按 .Kind 分流：taxonomy=chip 云 / term=内容卡网格——
                     #   Hugo 0.146+ term 页会命中 taxonomy.html，_default/term.html 无效勿重建、
                     #   _markup/render-codeblock 代码块钩子）、posts/（single/list）、notes/（花园 list/笔记 single）、
                     #   tags/taxonomy.html（标签拓扑页，仅接管 /tags/ 总览）、index.html、404.html、
                     #   partials/（head/site-header/site-footer/vendor-assets/back-to-top/pagination +
                     #   home/ 首页七段 + post/ 文章卡、作者卡、TOC、推荐阅读 + garden/ 笔记卡、stage 徽章、拓扑图）
assets/              # 主题层（要 Hugo Pipes 处理的资源）：css/main.src.css（Tailwind 源）、
                     #   js/main.js（主题切换/复制/scrollspy/mermaid/typeit）、images/（头像、favicon）
data/                # 内容层数据：site.yaml（菜单/页脚/openGraph/umami）、author.yaml（作者简介/打字机文案）、
                     #   home.yaml（首页五段文案；experience/skills 是 TODO 占位）、
                     #   stages.yaml（笔记生长阶段查表）、garden.yaml（宣言/园丁法则/Quick Sparks）
content/posts/       # 19 篇迁移文章（front matter 用 url: 固定旧 Jekyll URL，形如 /YYYY/MM/DD/<slug>.html）
content/notes/       # 数字花园笔记（front matter：stage/version/tags/related，见「代码与内容约定」）
content/about.md     # 关于页（layouts/_default/about.html）
content/archives.md  # 归档页（layouts/_default/archives.html 按年份分组）
content/search.md    # 搜索页（layouts/_default/search.html，Pagefind UI 中文界面）
docs/                # style-guide-light.md / style-guide-dark.md / design-tokens-*.json（见上节）
static/              # 直出资源：assets/images/（文章配图）、fonts/material-symbols.woff2
scripts/             # build.sh / deploy.sh / verify_urls.js；oneoff/ 一次性脚本（migrate.js、gen_redirects.js、old_urls.js）
deploy/              # 服务器部署件：Caddyfile、docker-compose.yml（caddy+umami+postgres）、README.md
.github/workflows/deploy.yml    # push main 自动构建 + rsync 部署
```

## 代码与内容约定

- **所有文档、注释、提交信息用中文**，新增内容沿用现有中文风格。
- 分层约定：`layouts/` + `assets/` 是主题层，`content/` + `data/` 是内容层；站点文案集中在 `data/*.yaml`，模板直写中文（不建 i18n）。
- `assets/`（要 Pipes 处理：指纹、压缩、图片缩放）与 `static/`（原样直出）双轨：文章配图放 `static/assets/images/`（正文引用 `/assets/images/...` 不变）；字体走 mounts 到 `static/fonts/`。
- 文章 front matter 用 `url: "/YYYY/MM/DD/<slug>.html"` 固定旧站 URL（slug 规则与旧 Jekyll pretty slugify 一致）。**迁移后不得改动这些 URL**——旧站（dkisser.github.io）已部署同路径 301 跳转页指向新站；改动会导致外链与跳转失效。新增文章不在此约束内。
- 文章 front matter 开关：`math: true`（KaTeX）、`mermaid: true`（图表，代码块语言标 `mermaid`）按需开启；代码块支持 ` ```java {file="Demo.java"} ` 在头部显示文件名。
- 笔记（`content/notes/`）front matter：`stage: seedling|budding|evergreen`（萌芽/生长/常青，emoji 与文案查表 `data/stages.yaml`，配色在 `partials/garden/stage-badge.html`）、`version: "v0.x"`、`tags`、`related: [<笔记文件 slug>...]`（双向引用 = related 正向 + 反查 backlinks，模板自动互链）。
- 标签拓扑图（`/notes/` 侧栏与 `/tags/`）由 `partials/garden/tag-graph.html` 在**构建期**生成环形布局 SVG：节点为内容数前 8 的标签（半径 ∝ 数量），实线连中心最大标签，虚线为标签共现；不引入前端力学库。
- 旧文章正文以 `#`（h1）作章节标题：TOC（`markup.tableOfContents` 收 h1+h2 两级）与 "SECTION 0N" 徽章（仅 h1，CSS counter）都以此为准，新文章沿用此结构。
- 构建脚本 `scripts/build.sh` 与 CI（`.github/workflows/deploy.yml`）必须使用完全相同的命令，改动构建流程时两边同步。
- 模板里的动态 class 必须写完整类名（Tailwind v4 自动内容扫描 `layouts/`、`assets/js/`）；`stitch/` 已 gitignore 不参与扫描。
- `public/` 与 `assets/css/main.css` 是构建产物，已 gitignore；`node_modules/` 在容器内是 Linux 版依赖（命名卷保留，勿用宿主机 macOS 版覆盖）。
- 一次性/迁移脚本放 `scripts/oneoff/`（不随构建运行），常驻脚本留 `scripts/`。

## 测试与验证

本项目无单元测试框架，验证手段是构建 + URL 校验：

```bash
npm run build     # 含 Tailwind 编译
npm run verify    # 必须输出 19/19 命中
```

提交涉及配置、模板或文章的改动前，应至少跑通上述两条。视觉验证用 `hugo server` 人工检查双主题（主题切换按钮在 浅色⇄深色 两态间切换，默认浅色、不跟随系统）。

## 部署架构

- 服务器侧：Docker + Caddy（根域名承载静态博客，自动签 Let's Encrypt 证书）+ 自建 umami 统计（仅 `/script.js`、`/api/send` 经 `stats.<域名>` 放行，后台走 SSH 隧道，不暴露公网）。详见 `deploy/README.md`。
- 主路径：push 到 `main` 触发 GitHub Actions（`.github/workflows/deploy.yml`），构建后 `rsync -az --delete` 推到服务器。需要 5 个 Secrets：`DEPLOY_SSH_KEY`、`DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_PATH`、`DEPLOY_PORT`。
- 兜底路径：本地 `cp .env.example .env` 填值后 `npm run deploy`。
- 服务器上 rsync 目标目录（`DEPLOY_PATH`，即 `/home/paul/blog/public`）必须与 `deploy/docker-compose.yml` 中 Caddy 挂载的宿主机路径一致。服务器部署根目录为 `/home/paul/blog`（docker-compose、Caddyfile、.env 都放这里）。

## 部署前待办（当前状态）

真实域名已确定为 `dkisser.cn`：baseURL、openGraph.url、gitRepo、Caddyfile（含 stats 子域）均已配好。剩余待办：

- 作者头像 `assets/images/author/paul.jpg` 当前是占位图（画面含 "TeXt Theme" 字样），需替换；favicon `assets/images/site/favicon.png` 同为占位
- `data/home.yaml` 中 experience / skills 段是 TODO 占位，待填真实履历
- 服务器 `deploy/.env`；GitHub Secrets 5 项
- 正文 `content/about.md` 的自我介绍
- 19 篇文章的 tags 为批量代拟（2026-09），待作者逐篇审阅校准；笔记体系已有 3 篇示例（`content/notes/`），按需替换为真实笔记

## 安全注意事项

- `.env`（部署参数）与 `deploy/.env`（数据库密码、APP_SECRET）均已 gitignore，**不得提交真实值**；模板见 `.env.example` 与 `deploy/.env.example`。
- `DEPLOY_SSH_KEY` 私钥只存在于 GitHub Secrets 与运维人员本机，不得写入仓库任何文件。
- umami 后台不暴露公网；如需访问走 `ssh -L 3000:localhost:3000 <user>@<server>` 隧道。
- `scripts/oneoff/gen_redirects.js` 只写输出目录 `redirect_dist/`，不会对旧仓库做任何写操作。
