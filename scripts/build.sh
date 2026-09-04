#!/usr/bin/env bash
# 构建脚本：与 CI (.github/workflows/deploy.yml) 使用完全相同的命令
set -euo pipefail
cd "$(dirname "$0")/.."

hugo --minify --cleanDestinationDir
npx pagefind --site public

echo "构建完成: public/"
