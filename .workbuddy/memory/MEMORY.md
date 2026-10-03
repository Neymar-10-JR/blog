# 个人博客项目长期记录

## 目标
用户（郭子晖，广州大学 AI 硕士，目标腾讯后端开发）的个人技术博客：
展示学习成果，并在论文投稿时作为可核验的学术主页。

## 技术选型（已确定）
- 框架：VitePress 1.6.4（Markdown 驱动，内置搜索/代码高亮）
- 托管：Cloudflare Pages（主），GitHub Pages（备用，默认关闭）
- 域名：暂用 `xxx.pages.dev` 免费二级域名
- 公式：markdown-it-mathjax3（需配 `vue.template.compilerOptions.isCustomElement`）
- 全部零成本：服务器/带宽/SSL/CI 均免费

## 项目约定
- 文章放 `docs/posts/`，一篇一个 md；frontmatter 必填 `title`、`date`（建议加引号）
- 可选字段：`tags`、`category`、`summary`、`sticky`
- 侧边栏与归档页均由脚本自动生成，新增文章只需加 frontmatter，不用改配置
- 常用命令：`npm run dev` / `npm run build` / `npm run preview`
- Node 使用托管版本：`/Users/guozihui/.workbuddy/binaries/node/versions/22.22.2-3/bin`

## 上线前待办
替换 `config.mts` 中的 hostname 与 socialLinks、`about.md` 联系方式、
`projects.md` 的 Ragent 详情、`publications.md` 的论文条目与 BibTeX。
