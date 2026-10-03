# 个人技术博客

基于 **VitePress** 的零成本静态博客，Markdown 写作，`git push` 后自动上线。

**当前线上地址**：https://guozihui-tech-blog.app.workbuddy.host/ （HTTPS，任何网络可访问）

## 一、本地运行

```bash
npm install
npm run dev        # 开发预览 http://localhost:5173
npm run build      # 构建产物输出到 docs/.vitepress/dist
npm run preview    # 本地预览构建结果
```

## 二、目录结构

```
.
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts        # 站点配置：导航、搜索、公式、站点地图
│   │   ├── theme/
│   │   │   ├── index.ts      # 主题入口
│   │   │   ├── posts.data.ts # 文章数据加载器（自动收集文章）
│   │   │   └── style.css     # 自定义样式
│   │   └── utils/posts.ts    # 从 Markdown frontmatter 读取元信息
│   ├── posts/                # 所有文章放这里
│   │   ├── index.md          # 归档页（自动生成列表）
│   │   └── *.md
│   ├── projects.md           # 项目展示页（推荐放 Ragent）
│   ├── publications.md       # 论文列表页（投稿时可引用）
│   ├── tags.md               # 标签聚合页
│   ├── about.md              # 个人介绍
│   └── index.md              # 首页
└── .github/workflows/deploy-pages.yml  # 可选：备用 GitHub Pages 部署
```

## 三、写一篇新文章

在 `docs/posts/` 下新建 `.md` 文件，开头加上 frontmatter：

```markdown
---
title: 文章标题
date: 2026-10-04
tags: [RAG, Milvus, 后端]
category: 人工智能
summary: 一句话摘要，会显示在归档卡片上。
sticky: false
---

正文从这里开始……
```

字段说明：

| 字段 | 必填 | 作用 |
| --- | --- | --- |
| `title` | 是 | 标题，同时用于归档页与 SEO |
| `date` | 是 | 发布日期，**建议加引号**，用于排序与归档分组 |
| `tags` | 否 | 标签数组，自动出现在标签页 |
| `category` | 否 | 分类，显示在文章卡片上 |
| `summary` | 否 | 卡片摘要；不写则自动截取正文开头 |
| `sticky` | 否 | `true` 时置顶到归档页顶部 |

写完后：

```bash
git add . && git commit -m "add: 文章标题" && git push
```

推送即部署，无需任何手动构建。

## 四、部署上线

本项目有两套部署方式，可以同时并存。

### 4.1 一键发布到分享链接（当前已启用）

已经关联好 `publish/` 目录，更新线上内容的流程是：

```bash
npm run sync:publish   # 重新构建并把产物同步到 publish/ 目录
```

执行后再走一次发布动作即可覆盖线上内容，链接保持不变。

> 注意：`cleanUrls` 已设为 `false`，站内链接统一带 `.html` 后缀，
> 这样任何静态服务器都能正确解析，不依赖服务端自动补后缀的能力。

### 4.2 部署到 Cloudflare Pages（推荐作为长期方案）

1. 在 GitHub 新建一个仓库（Public 或 Private 均可），把本目录推上去。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Import an existing Git repository**。
3. 选中刚才的仓库，点击 **Begin setup**，构建配置填：

   | 配置项 | 值 |
   | --- | --- |
   | Framework preset | None（或 VitePress） |
   | Build command | `npm run build` |
   | Build output directory | `docs/.vitepress/dist` |
   | Node version | 在环境变量里设置 `NODE_VERSION = 22` |

4. 点 **Save and Deploy**，约 1-2 分钟后即可访问，Cloudflare 会分配一个免费的 `xxx.pages.dev` 域名，HTTPS 证书自动签发。

之后每次 `git push`，站点都会自动重建。

## 五、待补充的信息

上线前建议替换以下几处占位内容（搜 `TODO` 即可定位）：

- `docs/about.md` 的邮箱与 Google Scholar 地址（GitHub 已填）
- `docs/projects.md` 中 Ragent 部分你自己的改动与解决的问题
- `docs/publications.md` 的论文条目、PDF / arXiv 链接与 BibTeX
- `docs/.vitepress/config.mts` 中的 hostname（换域名后）与 Google Scholar 社交链接

账号信息：GitHub 主页 <https://github.com/Neymar-10-JR>，后续推送仓库时用它作为 remote。

## 六、数学公式

已集成 `markdown-it-mathjax3`，行内公式 `$...$`，块级公式：

```latex
$$
\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$
```

直接从 LaTeX 论文里粘贴即可渲染。

## 七、成本

服务器、带宽、SSL 证书、CI 构建均为 0 元，Cloudflare Pages 免费套餐不限流量与请求数。只有自定义域名会产生每年几十元的注册费。
