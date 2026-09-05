# syntax=docker/dockerfile:1
# 开发用镜像：Hugo extended + Node 22(npm)
# 自研主题后不再需要 Go（无 Hugo Modules 依赖）
# 支持 linux/amd64 与 linux/arm64（通过 buildkit 内建 TARGETARCH 自动选择 tarball）

FROM debian:bookworm-slim

ARG TARGETARCH
ARG HUGO_VERSION=0.165.0
ARG NODE_VERSION=22.15.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Hugo extended（版本与本地一致 0.165.0）
RUN case "$TARGETARCH" in \
      amd64) HUGOARCH=amd64 ;; \
      arm64) HUGOARCH=arm64 ;; \
      *) echo "unsupported arch: $TARGETARCH" && exit 1 ;; \
    esac \
    && curl -fsSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${HUGOARCH}.tar.gz" -o /tmp/hugo.tar.gz \
    && tar -C /usr/local/bin -xzf /tmp/hugo.tar.gz hugo \
    && rm /tmp/hugo.tar.gz

# Node 22 + npm（官方 tarball；amd64 对应发行版的 x64 命名）
RUN case "$TARGETARCH" in \
      amd64) NODEARCH=x64 ;; \
      arm64) NODEARCH=arm64 ;; \
      *) echo "unsupported arch: $TARGETARCH" && exit 1 ;; \
    esac \
    && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODEARCH}.tar.gz" -o /tmp/node.tar.gz \
    && tar -C /usr/local --strip-components=1 -xzf /tmp/node.tar.gz \
    && rm /tmp/node.tar.gz

WORKDIR /app

# 先装 npm 依赖（利用 Docker layer 缓存；lock 文件不变则不重装）
COPY package.json package-lock.json ./
RUN npm ci

# 拷贝源码（主题已自研入库，无需预热任何 module 缓存）
COPY . .

EXPOSE 1313

# 先产出一次 Tailwind CSS（assets/css/main.css 是生成物、不入库），
# 再后台 watch CSS、前台跑 hugo server
CMD ["sh", "-c", "npm run css && npm run css:watch & exec hugo server --bind 0.0.0.0 --port 1313 --disableFastRender --navigateToChanged"]
