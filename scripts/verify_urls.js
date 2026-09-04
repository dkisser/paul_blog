#!/usr/bin/env node
/**
 * 验证 public/ 下 19 篇文章的输出路径与旧 Jekyll 线上 URL 完全一致。
 *
 * 用法:
 *   node scripts/verify_urls.js [public_dir]   （或 npm run verify）
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { OLD_URLS } = require('./old_urls');

function main() {
  const publicDir = path.resolve(process.argv[2] || 'public');
  if (!fs.existsSync(publicDir) || !fs.statSync(publicDir).isDirectory()) {
    console.error(`目录不存在: ${publicDir}，请先运行 hugo 构建`);
    process.exit(1);
  }

  const failed = [];
  for (const url of OLD_URLS) {
    const file = path.join(publicDir, url.replace(/^\//, ''));
    const ok = fs.existsSync(file) && fs.statSync(file).isFile();
    console.log(`[${ok ? 'OK' : 'MISS'}] ${url}`);
    if (!ok) failed.push(url);
  }

  console.log(`\n${OLD_URLS.length - failed.length}/${OLD_URLS.length} 命中`);
  if (failed.length > 0) process.exit(1);
}

main();
