# 服务器部署指南（国内 Linux 服务器，Docker + Caddy + umami）

> 占位值：`your-server-ip-or-host.example.com`（服务器地址，仅示意后缀）、`/srv/paul_blog/public`（博客静态目录）。
> 域名已确定为 `dkisser.cn`（主站）/ `stats.dkisser.cn`（umami 采集端点），Caddyfile 已配好。

## 架构

```
公网
 ├─ 80/443 → Caddy ── dkisser.cn        → /srv/blog（静态文件，rsync 推送目标）
 │                    └ stats.dkisser.cn → 仅 /script.js、/api/send → umami:3000（其余 404）
 └─（umami 后台不暴露公网，SSH 隧道访问 127.0.0.1:3000）
```

## 初始化步骤

### 1. 安装 Docker（以 Ubuntu 为例，其他发行版见 Docker 官方文档）

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # 重新登录后生效
```

### 2. 创建目录并拷贝部署件

```bash
sudo mkdir -p /srv/paul_blog/public
sudo chown -R $USER:$USER /srv/paul_blog
mkdir -p ~/paul_blog
# 把本目录（deploy/）下的 Caddyfile、docker-compose.yml、.env.example 拷到 ~/paul_blog/
cd ~/paul_blog
cp .env.example .env   # 编辑 .env 填入真实密码与 APP_SECRET
# Caddyfile 中的域名（dkisser.cn / stats.dkisser.cn）已配好，确认即可
```

注意：**`/srv/paul_blog/public` 必须同时是**：
- 本地/GitHub Actions rsync 推送的目标路径（`DEPLOY_PATH=/srv/paul_blog/public/`）
- `docker-compose.yml` 中 Caddy 挂载的宿主机路径（容器内为 `/srv/blog`）

### 3. 启动

```bash
docker compose --env-file .env up -d
docker compose logs -f caddy    # 确认证书签发成功（需 80/443 已对公网开放且 DNS 已解析）
```

Caddy 会自动为 `dkisser.cn` 和 `stats.dkisser.cn` 申请 Let's Encrypt 证书（国内服务器需确认 443 出站可访问 LE；备案接入前证书签发可能失败，见第 6 节）。

### 4. umami 首次初始化（建管理员）

```bash
# 本机建立 SSH 隧道
ssh -L 3000:localhost:3000 <user>@<server>
# 浏览器打开 http://localhost:3000 ，默认账号 admin / umami，登录后立即改密码
```

### 5. 接入博客统计

umami 后台添加网站（域名填真实域名），拿到 Website ID 后：
在博客仓库 `hugo.yaml` 的 `params.features.analytics` 下启用 umami：

```yaml
analytics:
  enable: true
  services:
    umami:
      # 只走 Caddy 放行的采集端点；script.js 路径与 Caddyfile matcher 一致
      scheme: https
      instance: stats.dkisser.cn
      id: <website-id>
```

### 6. 备案接入提醒

服务器备案接入变更完成前，80/443 可能被拦截或证书签发失败。届时现象为：
Caddy 日志报证书申请超时。备案接入完成后重启 `docker compose restart caddy` 即可自动重试。

### 7. 日常运维

```bash
docker compose ps                 # 状态
docker compose logs -f umami      # 日志
docker compose --env-file .env up -d --pull always   # 升级镜像
```
