# syntax=docker/dockerfile:1
# 开发用镜像：Hugo extended + Go(Hugo Modules) + Node 22(npm)
# 支持 linux/amd64 与 linux/arm64（通过 buildkit 内建 TARGETARCH 自动选择 tarball）

FROM debian:bookworm-slim

ARG TARGETARCH
ARG GO_VERSION=1.27.0
ARG HUGO_VERSION=0.165.0
ARG NODE_VERSION=22.15.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Go（官方 tarball；Hugo Modules 拉取 toha 主题需要）
RUN case "$TARGETARCH" in \
      amd64) GOARCH=amd64 ;; \
      arm64) GOARCH=arm64 ;; \
      *) echo "unsupported arch: $TARGETARCH" && exit 1 ;; \
    esac \
    && curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-${GOARCH}.tar.gz" -o /tmp/go.tar.gz \
    && tar -C /usr/local -xzf /tmp/go.tar.gz \
    && rm /tmp/go.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"

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

# 拷贝源码并预热 Hugo module 缓存（toha 主题），容器启动即可用
COPY . .
RUN hugo mod get

EXPOSE 1313

CMD ["hugo", "server", "--bind", "0.0.0.0", "--port", "1313", "--disableFastRender", "--navigateToChanged"]
