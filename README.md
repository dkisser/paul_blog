# Paul的技术博客

基于 [Hugo](https://gohugo.io/)（extended 版）+ [Toha v4](https://github.com/hugo-toha/toha) 主题的个人博客，内容迁移自旧 Jekyll 博客（dkisser.github.io）。

## 本地开发

### 方式一：Docker（推荐，无需本地安装 Hugo/Go/Node）

```bash
docker compose up --build   # 首次构建镜像；之后 docker compose up 即可
# 访问 http://localhost:1313
```

仓库目录以 volume 挂载进容器，改文章即时生效；`node_modules` 通过命名卷保留镜像内 `npm ci` 装好的 Linux 版依赖（宿主机的 macOS 版 node_modules 在容器里用不了）。若 `package.json`/`package-lock.json` 变更，重新 `docker compose up --build` 后执行 `docker compose down -v && docker compose up` 刷新依赖卷。

### 方式二：裸机

```bash
npm install        # 安装主题前端依赖（bootstrap/katex/mermaid/pagefind 等）
hugo server        # http://localhost:1313
```

## 环境要求（仅裸机方式需要）

- Hugo ≥ 0.163（**extended** 版）
- Go ≥ 1.25（Hugo Modules 拉取主题用）
- Node.js ≥ 18 + npm（主题前端依赖与 Pagefind）

## 构建（含 Pagefind 搜索索引）

```bash
npm run build
# 等价于:
bash scripts/build.sh
# 即: hugo --minify --cleanDestinationDir && npx pagefind --site public
```

构建产物在 `public/`，搜索索引在 `public/pagefind/`（搜索页 `/search/` 引用其中的 pagefind-ui.js/css）。

## 部署

架构：服务器（Docker + Caddy，根域名承载博客）+ umami 自建统计（仅 `/script.js`、`/api/send` 经 `stats.<域名>` 放行到公网，后台走 SSH 隧道）。服务器侧部署件与初始化步骤见 `deploy/README.md`。

### 方式一：GitHub Actions（主路径）

push 到 `main` 自动构建并 rsync 推送（`.github/workflows/deploy.yml`）。需要配置的 Secrets（Settings → Secrets and variables → Actions）：

| Secret | 说明 |
| --- | --- |
| `DEPLOY_SSH_KEY` | 部署用 SSH 私钥（公钥已加入服务器部署用户的 authorized_keys） |
| `DEPLOY_HOST` | 服务器地址（IP 或域名） |
| `DEPLOY_USER` | SSH 用户 |
| `DEPLOY_PATH` | 目标目录，如 `/home/paul/blog/public`（须与 Caddy 挂载的宿主机路径一致） |
| `DEPLOY_PORT` | SSH 端口，如 `22` |

### 方式二：本地一键部署（兜底，Actions 不可用时）

```bash
cp .env.example .env   # 填入 DEPLOY_HOST / DEPLOY_USER / DEPLOY_PATH（.env 已 gitignore）
npm run deploy         # 构建 + rsync 推送
bash scripts/deploy.sh --dry-run   # 只预览 rsync 变更，不实际传输
```

## 旧站切换流程（dkisser.github.io → 新域名）

新站上线并验证无误后：

1. `NEW_ORIGIN=https://<真实域名> node scripts/gen_redirects.js`（默认输出 `redirect_dist/`）
2. 在旧仓库 dkisser.github.io 切一个备份分支保存原站点（如 `git branch backup-jekyll`）
3. 用 `redirect_dist/` 产物替换旧仓库内容（19 篇文章同路径跳转页 + 首页 + archive.html），push 后旧域名所有文章 URL 自动 301 跳转到新站同路径

`gen_redirects.js` 只写输出目录，不会对旧仓库做任何写操作。

## 目录结构

```
hugo.yaml            # 站点配置（baseURL 已定为 https://dkisser.cn/）
go.mod / go.sum      # Hugo Modules 引入 toha v4 主题（主题源码不入库）
data/zh-cn/          # Toha 数据驱动配置：author、site（导航/页脚）、sections/*
content/posts/       # 19 篇迁移文章（front matter 用 url: 固定旧 Jekyll URL）
content/about.md     # 关于页
content/archives.md  # 归档页（layouts/_default/archives.html 按年份分组）
content/search.md    # 搜索页（layouts/_default/search.html，Pagefind UI 中文界面）
assets/images/author/paul.jpg   # 头像（旧站 screenshot.jpg）
static/assets/images/           # 文章配图（正文 /assets/images/... 路径保持不变）
scripts/migrate.js   # 一次性迁移脚本（Jekyll _posts -> content/posts，Node.js）
scripts/old_urls.js  # 旧站 19 个线上 URL 清单（verify_urls / gen_redirects 共用）
scripts/verify_urls.js          # 校验 public/ 下 19 篇文章路径与旧 URL 一致
scripts/gen_redirects.js        # 生成旧站跳转页（输出 redirect_dist/，人工拷入旧仓库）
scripts/build.sh / deploy.sh    # 构建 / 构建+rsync 推送（与 CI 同命令）
deploy/              # 服务器部署件：Caddyfile、docker-compose.yml（caddy+umami+postgres）、README
.github/workflows/deploy.yml    # GitHub Actions 构建 + rsync 部署
```

## 旧 URL 保持不变

迁移时每篇文章的 front matter 逐篇写入 `url: "/YYYY/MM/DD/<slug>.html"`（与旧站线上 URL 完全一致，slug 规则同旧站 Jekyll pretty slugify）。验证方式：

```bash
hugo --minify --cleanDestinationDir
npm run verify   # 等价于 node scripts/verify_urls.js，输出 19/19 命中
```

迁移脚本可重复执行（幂等）：`npm run migrate`（等价于 `node scripts/migrate.js`）。

## 部署前 TODO

- ~~`hugo.yaml` 顶部 `baseURL` 与 `data/zh-cn/site.yaml` 里 openGraph.url~~（已完成，均为 https://dkisser.cn/）
- 替换站点背景图 / logo / favicon（现为 Toha 主题自带占位图，见 hugo.yaml `params.background`/`params.logo`）
- 填写真实简历 sections：`data/zh-cn/sections/` 下 skills / experiences / education / achievements（现为 TODO 占位）
- `data/zh-cn/sections/projects.yaml` 替换为真实项目卡片
- `content/about.md` 补正式自我介绍
- ~~`hugo.yaml` 里 `params.gitRepo`~~（已填 https://github.com/dkisser/paul_blog）
- 部署占位值：服务器上 `deploy/.env`（密码/APP_SECRET）、GitHub Secrets 5 项（见「部署」一节）、本地 `.env`（`.env.example` 模板）
- umami 后台建好网站后，在 `hugo.yaml` 开启 analytics.umami（instance 填 `stats.dkisser.cn`，步骤见 `deploy/README.md` 第 5 节）
