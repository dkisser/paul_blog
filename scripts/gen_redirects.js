#!/usr/bin/env node
/**
 * 生成旧站（dkisser.github.io）的跳转页。
 *
 * 为 19 篇文章各生成一个同路径的 HTML（meta refresh + canonical + 文字链接），
 * 外加首页(/)和 /archive.html 跳转到新域名根。
 *
 * 用法:
 *   node scripts/gen_redirects.js [输出目录]     # 默认 redirect_dist/
 *   NEW_ORIGIN=https://<真实域名> node scripts/gen_redirects.js
 *
 * 注意: 本脚本只写输出目录，绝不写 ../dkisser.github.io。
 * 产物由人工拷入旧仓库并 push（先备份分支，流程见 README「旧站切换」）。
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { OLD_URLS } = require('./old_urls');

// 新站域名（不带结尾 /），可用环境变量 NEW_ORIGIN 覆盖
const NEW_ORIGIN = (process.env.NEW_ORIGIN || 'https://dkisser.cn').replace(/\/+$/, '');
const OUT_DIR = path.resolve(process.argv[2] || 'redirect_dist');

function redirectHtml(targetUrl) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${targetUrl}">
<link rel="canonical" href="${targetUrl}">
<title>页面已迁移</title>
</head>
<body>
<p>本页面已迁移至新地址：<a href="${targetUrl}">${targetUrl}</a></p>
</body>
</html>
`;
}

function writeRedirect(relPath, targetUrl) {
  const file = path.join(OUT_DIR, relPath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, redirectHtml(targetUrl), 'utf8');
  console.log(`[生成] ${relPath} -> ${targetUrl}`);
}

function main() {
  // 19 篇文章：同路径跳转
  for (const url of OLD_URLS) {
    writeRedirect(url, `${NEW_ORIGIN}${url}`);
  }
  // 首页与归档页：跳到新域名根
  writeRedirect('/index.html', `${NEW_ORIGIN}/`);
  writeRedirect('/archive.html', `${NEW_ORIGIN}/`);

  console.log(`\n共生成 ${OLD_URLS.length + 2} 个跳转页，输出目录: ${OUT_DIR}`);
}

main();
