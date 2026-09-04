#!/usr/bin/env bash
# 本地一键构建 + 推送（GitHub Actions 不可用时的兜底路径）
#
# 用法:
#   bash scripts/deploy.sh            # 构建并 rsync 推送
#   bash scripts/deploy.sh --dry-run  # 构建后仅预览 rsync 变更（rsync -n），不实际传输
#
# 部署参数从项目根 .env 读取（模板见 .env.example）:
#   DEPLOY_HOST       服务器地址（占位，需替换）
#   DEPLOY_USER       SSH 用户
#   DEPLOY_PATH       服务器上的目标目录（即 Caddy 挂载的博客静态目录，见 deploy/README.md）
#   DEPLOY_SSH_PORT   SSH 端口，默认 22
set -euo pipefail
cd "$(dirname "$0")/.."

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN=1 ;;
    *) echo "未知参数: $arg（仅支持 --dry-run）" >&2; exit 2 ;;
  esac
done

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
else
  echo "提示: 未找到 .env，请从 .env.example 复制一份并填入真实值" >&2
fi

: "${DEPLOY_HOST:?缺少 DEPLOY_HOST（见 .env.example）}"
: "${DEPLOY_USER:?缺少 DEPLOY_USER（见 .env.example）}"
: "${DEPLOY_PATH:?缺少 DEPLOY_PATH（见 .env.example）}"
DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"

bash scripts/build.sh

RSYNC_ARGS=(-az --delete -e "ssh -p ${DEPLOY_SSH_PORT}")
if [[ "$DRY_RUN" -eq 1 ]]; then
  RSYNC_ARGS+=(-n --itemize-changes)
  echo "[dry-run] 仅预览，不实际传输"
fi

echo "rsync public/ -> ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} (端口 ${DEPLOY_SSH_PORT})"
rsync "${RSYNC_ARGS[@]}" public/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "[dry-run] 完成（未做任何远端变更）"
else
  echo "部署完成"
fi
