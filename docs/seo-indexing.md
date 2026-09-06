# 搜索引擎收录指南

> 整理日期：2026-09-06。目标：让 `https://dkisser.cn/` 被主流搜索引擎收录。

## 结论：不是只能百度

百度不是唯一选择，也不应该是第一个做的。按性价比排序：Google → Bing → 百度。

## 站点技术底子（已就绪）

- Hugo 静态站，爬虫直接拿到完整 HTML —— 百度蜘蛛 JS 渲染能力弱，静态站天然友好
- `sitemap.xml`：Hugo 自动生成（`hugo.yaml` sitemap 段），含 55 个 URL
- `static/robots.txt`：已创建（2026-09-06），放行所有蜘蛛 + 声明 sitemap 地址
- `head.html` 已有 canonical / meta description / og 标签
- Caddyfile 无 UA 屏蔽，蜘蛛可正常抓取

## 三个平台的操作步骤

### 1. Google Search Console（建议最先做）

- 地址：https://search.google.com/search-console
- 收录不看服务器所在地，也不需要备案。国内用 Google 的技术读者（走代理）是技术博客的精准受众
- 验证方式选「HTML 文件」：把验证文件放进 `static/`，部署后点验证
- 验证后提交 sitemap：`https://dkisser.cn/sitemap.xml`

### 2. Bing Webmaster Tools

- 地址：https://www.bing.com/webmasters
- cn.bing.com 国内可直接访问，是国内能正常用的国际搜索引擎
- 最省事：完成 Google 验证后，Bing 支持从 GSC **一键导入站点和 sitemap**
- 支持 IndexNow 协议，发新文章可即时推送

### 3. 百度搜索资源平台

- 地址：https://ziyuan.baidu.com
- 国内流量入口最大，但**百度极度重视 ICP 备案**：未备案站点收录慢甚至不收；有备案后可用「快速收录」权限
- 若服务器在国内，域名本来就需要备案；已备案则百度这条路会顺很多
- 验证同样支持 HTML 文件 / meta 标签，之后提交 sitemap 即可

搜狗、360 份额太小，可忽略。

## 行动清单

- [ ] 部署一次，让 `robots.txt` 上线（`npm run deploy` 或 push main 走 CI），确认 `https://dkisser.cn/robots.txt` 可访问
- [ ] 注册 Google Search Console → HTML 文件验证（放 `static/`）→ 提交 sitemap
- [ ] 注册 Bing Webmaster Tools → 从 GSC 一键导入
- [ ] （如有 ICP 备案）注册百度搜索资源平台 → 验证 → 提交 sitemap

## 后续注意事项

- 收录需要时间：Google 一般几天到两周，新站百度可能要一两个月
- 加快收录最有效的手段：保持更新频率 + 外链（GitHub profile、掘金/知乎个人主页挂上博客链接）
- 新文章发布后可在 Bing 用 IndexNow 主动推送；百度（已备案）可用快速收录 API
- 各平台验证文件一旦放入 `static/`，**不要删除**，部分平台会定期复查
