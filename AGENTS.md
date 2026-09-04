# AGENTS.md

面向 AI 编码代理的项目说明。本文件基于对仓库实际内容的梳理，更新日期 2026-09-04。

## 项目概述

**Paul的技术博客** —— 基于 [Hugo](https://gohugo.io/)（extended 版）+ [Toha v4](https://github.com/hugo-toha/toha) 主题的简体中文个人静态博客。内容从旧 Jekyll 博客（dkisser.github.io）迁移而来，共 19 篇文章。

- 站点配置：`hugo.yaml`（单语言 zh-cn，`baseURL` 已定为 `https://dkisser.cn/`）
- 主题通过 Hugo Modules 引入：`go.mod` 声明 `github.com/hugo-toha/toha/v4 v4.16.0`（主题源码不入库，由 `hugo mod get` 拉取）
- 搜索使用 **Pagefind**（构建后索引 `public/pagefind/`）；Toha 内置的 Fuse.js 搜索已关闭（`outputs` 里不输出 JSON）

## 技术栈与版本

| 组件 | 版本 | 用途 |
| --- | --- | --- |
| Hugo extended | 0.165.0 | 静态站点生成（裸机要求 ≥ 0.163） |
| Go | ≥ 1.25（CI/Docker 用 1.27） | Hugo Modules 拉取主题 |
| Node.js | ≥ 18（CI/Docker 用 22） | 主题前端依赖（npm）与 Pagefind |
| npm 前端依赖 | 见 `package.json` devDependencies | bootstrap、katex、mermaid、pagefind、highlight.js 等（全部为 Toha 主题需要，勿删） |

注意：`hugo.yaml` 自定义了 `module.mounts`，会把 Hugo 默认挂载覆盖掉，必须显式补回 `static` 和 `assets`；另外把 `node_modules` 里的 flag-icons / @fontsource/mulish / katex 字体挂载到 `static/` 下。改动 mounts 时要保持这些条目完整。

## 常用命令

```bash
# 本地开发
docker compose up --build      # 推荐：无需本地装 Hugo/Go/Node，访问 http://localhost:1313
# 或裸机：
npm install && hugo server     # 同端口

# 构建（含 Pagefind 索引；与 CI 完全同命令）
npm run build                  # = bash scripts/build.sh = hugo --minify --cleanDestinationDir && npx pagefind --site public

# URL 校验（构建后验证 19 篇文章路径与旧站 URL 一致，应输出 19/19 命中）
npm run verify                 # = node scripts/verify_urls.js

# 一次性迁移脚本（幂等，Jekyll _posts -> content/posts）
npm run migrate                # = node scripts/migrate.js

# 部署
npm run deploy                 # = bash scripts/deploy.sh（构建 + rsync 推送，参数读项目根 .env）
bash scripts/deploy.sh --dry-run   # 只预览 rsync 变更
```

裸机环境最低要求：Hugo ≥ 0.163（extended）、Go ≥ 1.25、Node ≥ 18。

## 目录结构

```
hugo.yaml            # 站点配置（baseURL 占位，部署前替换；功能开关都在 params.features）
go.mod / go.sum      # Hugo Modules 引入 toha v4（主题源码不入库）
data/zh-cn/          # Toha 数据驱动配置：author.yaml、site.yaml（导航/页脚/openGraph）、sections/*
                     #   sections/ 下 skills、experiences、education、achievements、projects 目前是 TODO 占位
content/posts/       # 19 篇迁移文章（front matter 用 url: 固定旧 Jekyll URL，形如 /YYYY/MM/DD/<slug>.html）
content/about.md     # 关于页（模板 layouts/_default/about.html）
content/archives.md  # 归档页（layouts/_default/archives.html 按年份分组）
content/search.md    # 搜索页（layouts/_default/search.html，Pagefind UI 中文界面）
layouts/_default/    # 本站仅有的 3 个自定义模板（about/archives/search），其余继承主题
assets/images/       # 构建期资源（作者头像等）
static/assets/images/  # 文章配图，正文以 /assets/images/... 引用
scripts/             # build.sh / deploy.sh / migrate.js / verify_urls.js / gen_redirects.js / old_urls.js
deploy/              # 服务器部署件：Caddyfile、docker-compose.yml（caddy+umami+postgres）、README.md
.github/workflows/deploy.yml    # push main 自动构建 + rsync 部署
```

## 代码与内容约定

- **所有文档、注释、提交信息用中文**，新增内容沿用现有中文风格。
- 文章 front matter 用 `url: "/YYYY/MM/DD/<slug>.html"` 固定旧站 URL（slug 规则与旧 Jekyll pretty slugify 一致）。**迁移后不得改动这些 URL**——旧站（dkisser.github.io）已部署同路径 301 跳转页指向新站；改动会导致外链与跳转失效。新增文章不在此约束内。
- 构建脚本 `scripts/build.sh` 与 CI（`.github/workflows/deploy.yml`）必须使用完全相同的命令，改动构建流程时两边同步。
- 文章配图放 `static/assets/images/`（保持正文引用路径 `/assets/images/...` 不变）。
- `public/` 是构建产物，已 gitignore；`node_modules/` 亦为命名卷保留（容器内是 Linux 版依赖，勿用宿主机 macOS 版覆盖）。

## 测试与验证

本项目无单元测试框架，验证手段是构建 + URL 校验：

```bash
hugo --minify --cleanDestinationDir
npm run verify    # 必须输出 19/19 命中
```

提交涉及配置、模板或文章的改动前，应至少跑通 `npm run build` 且 `npm run verify` 全绿。

## 部署架构

- 服务器侧：Docker + Caddy（根域名承载静态博客，自动签 Let's Encrypt 证书）+ 自建 umami 统计（仅 `/script.js`、`/api/send` 经 `stats.<域名>` 放行，后台走 SSH 隧道，不暴露公网）。详见 `deploy/README.md`。
- 主路径：push 到 `main` 触发 GitHub Actions（`.github/workflows/deploy.yml`），构建后 `rsync -az --delete` 推到服务器。需要 5 个 Secrets：`DEPLOY_SSH_KEY`、`DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_PATH`、`DEPLOY_PORT`。
- 兜底路径：本地 `cp .env.example .env` 填值后 `npm run deploy`。
- 服务器上 rsync 目标目录（`DEPLOY_PATH`，如 `/srv/paul_blog/public/`）必须与 `deploy/docker-compose.yml` 中 Caddy 挂载的宿主机路径一致。

## 部署前待办（当前状态）

真实域名已确定为 `dkisser.cn`：baseURL、openGraph.url、gitRepo、Caddyfile（含 stats 子域）均已配好。剩余待办（详见 README「部署前 TODO」）：

- 站点背景图 / logo / favicon（现为 Toha 占位图，放 `static/images/site/`）
- `data/zh-cn/sections/` 下 skills / experiences / education / achievements / projects 的 TODO 占位
- 服务器 `deploy/.env`；GitHub Secrets 5 项
- 正文 `content/about.md` 的自我介绍

## 安全注意事项

- `.env`（部署参数）与 `deploy/.env`（数据库密码、APP_SECRET）均已 gitignore，**不得提交真实值**；模板见 `.env.example` 与 `deploy/.env.example`。
- `DEPLOY_SSH_KEY` 私钥只存在于 GitHub Secrets 与运维人员本机，不得写入仓库任何文件。
- umami 后台不暴露公网；如需访问走 `ssh -L 3000:localhost:3000 <user>@<server>` 隧道。
- `gen_redirects.js` 只写输出目录 `redirect_dist/`，不会对旧仓库做任何写操作。
