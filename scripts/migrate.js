#!/usr/bin/env node
/**
 * 一次性迁移脚本：从旧 Jekyll 博客 (_posts/) 生成 Hugo 内容。
 *
 * 用法:
 *   node scripts/migrate.js   （或 npm run migrate）
 *
 * 源仓库(只读): /Users/wenchen/workspace/github/dkisser.github.io
 * 输出: content/posts/<slug>.md
 *
 * 关键行为:
 * - 从文件名 YYYY-MM-DD-<标题>.md 解析日期与标题
 * - slug 按旧站实际生效的 Jekyll "pretty" slugify 规则生成
 *   (保留 Unicode 字母数字及 ._~!$&'()+,;=@, 其余字符折叠为单个 -)
 * - 旧站线上 URL 不带 _posts 子目录前缀(已与线上 archive 页逐一核实):
 *   全部文章 URL 均为 /YYYY/MM/DD/<slug>.html
 * - 逐篇写入 front matter: title / date / url / categories(仅子目录文章)
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SRC = '/Users/wenchen/workspace/github/dkisser.github.io';
const DST = path.join(__dirname, '..', 'content', 'posts');

// Jekyll SLUGIFY_PRETTY_REGEXP 保留的 ASCII 符号
const PRETTY_KEEP = new Set("._~!$&'()+,;=@".split(''));

// 等价于 Python 的 ch.isalnum()（Unicode 字母 + 数字）
const ALNUM_RE = /^[\p{L}\p{N}\p{Nl}\p{No}]$/u;

/** 模拟旧站实际生效的 Jekyll pretty slugify。 */
function prettySlugify(text) {
  let out = '';
  for (const ch of text) {
    if (ALNUM_RE.test(ch) || PRETTY_KEEP.has(ch)) {
      out += ch;
    } else {
      out += '-';
    }
  }
  return out.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

function yamlQuote(s) {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

/** 递归收集 dir 下所有 .md 文件（返回绝对路径，排序后稳定输出）。 */
function collectMarkdown(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdown(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function main() {
  const postsDir = path.join(SRC, '_posts');
  const posts = collectMarkdown(postsDir).sort();
  if (posts.length === 0) {
    console.error('未找到任何文章');
    process.exit(1);
  }

  fs.mkdirSync(DST, { recursive: true });
  const urls = [];
  for (const src of posts) {
    const m = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/.exec(path.basename(src));
    if (!m) {
      console.error(`跳过无法解析的文件名: ${src}`);
      continue;
    }
    const [, year, month, day, title] = m;
    const slug = prettySlugify(title);
    const url = `/${year}/${month}/${day}/${slug}.html`;

    const rel = path.relative(postsDir, src).split(path.sep).join('/');
    const parts = rel.split('/');
    const category = parts.length > 1 ? parts[0] : null;

    const fmLines = [
      '---',
      `title: ${yamlQuote(title)}`,
      `date: ${year}-${month}-${day}`,
      `url: ${yamlQuote(url)}`,
    ];
    if (category) {
      fmLines.push(`categories: [${yamlQuote(category)}]`);
    }
    fmLines.push('---');

    const body = fs.readFileSync(src, 'utf8');
    const out = path.join(DST, `${slug}.md`);
    fs.writeFileSync(out, fmLines.join('\n') + '\n\n' + body, 'utf8');
    urls.push(url);
    console.log(`[迁移] ${rel} -> content/posts/${slug}.md  url=${url}`);
  }

  console.log(`\n共迁移 ${urls.length} 篇文章`);
}

main();
