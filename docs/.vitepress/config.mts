import { defineConfig } from 'vitepress'
import MathJax3 from 'markdown-it-mathjax3'
import { buildPostSidebar } from './utils/posts'

// 部署基路径。部署到 GitHub Pages 的项目站点时，地址形如
// https://neymar-10-jr.github.io/blog/ ，所以必须显式声明 base，
// 否则构建出的资源路径会指向域名根目录而全部 404。
// 换成自定义域名（如 https://guozihui.top/ ）后，把这里改成 '/'。
const base = '/blog/'

// 站点正式地址（用于站点地图与 OG 标签）
const origin = 'https://neymar-10-jr.github.io'

export default defineConfig({
  lang: 'zh-CN',
  // GitHub Pages 项目站点部署在子路径下，base 必须与仓库名一致
  base,
  title: '郭子晖的技术博客',
  titleTemplate: ':title | 郭子晖',
  description: '后端工程、检索增强生成（RAG）与论文阅读笔记',
  // 关闭 cleanUrls：改为生成 /tags/index.html 这类目录式路径，
  // 任何静态服务器都能正确解析；开启 cleanUrls 需要服务端支持补 .html 后缀，
  // 否则 /tags 会 404。
  cleanUrls: false,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    // head 里的 href 不会自动补 base，需要手动拼接
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'author', content: '郭子晖' }],
    ['meta', { name: 'keywords', content: '后端开发,RAG,Milvus,Spring Boot,Redis,人工智能,广州大学' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '郭子晖的技术博客' }],
    ['meta', { property: 'og:description', content: '后端工程、检索增强生成（RAG）与论文阅读笔记' }],
    ['meta', { property: 'og:url', content: `${origin}${base}` }]
  ],

  sitemap: {
    hostname: origin,
    // VitePress 生成的条目是 /about.html 这类根绝对路径，
    // sitemap 库会据此解析到域名根目录，导致丢掉 /blog 前缀，故手动补上。
    transformItems: (items) =>
      items.map((item: { url: string }) => ({
        ...item,
        url: `${base}${String(item.url).replace(/^\//, '')}`
      }))
  },

  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
    config(md) {
      // 支持 LaTeX 公式：行内 $...$，块级 $$...$$
      md.use(MathJax3, {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']]
        },
        options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }
      })
    }
  },

  vue: {
    // MathJax 输出的是 <mjx-container> 这类自定义标签，
    // 不放行的话 Vue 编译器会把它当成未注册组件而丢弃，公式会渲染成空白。
    template: {
      compilerOptions: {
        isCustomElement: (tag) =>
          tag === 'mjx-container' || tag === 'mjx-assistive-mml' || tag === 'mjx-math'
      }
    }
  },

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文章' },
          modal: {
            displayDetails: '显示详细信息',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '返回',
            noResultsText: '没有找到相关结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: 'enter',
              navigateText: '切换',
              navigateUpKeyAriaLabel: 'up arrow',
              navigateDownKeyAriaLabel: 'down arrow',
              closeText: '关闭',
              closeKeyAriaLabel: 'escape'
            }
          }
        }
      }
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags' },
      { text: '项目', link: '/projects' },
      { text: '论文', link: '/publications' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/posts/': buildPostSidebar()
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    sidebarMenuLabel: '文章列表',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    externalLinkIcon: true,

    // 文章底部显示「在 GitHub 上编辑此页」
    editLink: {
      pattern: 'https://github.com/Neymar-10-JR/blog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Neymar-10-JR' }
      // TODO: 论文投稿后追加 Google Scholar 主页链接
      // { icon: 'languages', link: 'https://scholar.google.com/citations?user=YOUR_ID', ariaLabel: 'Google Scholar' }
    ],

    footer: {
      message: '内容基于 CC BY-NC-SA 4.0 发布，转载请注明出处。',
      copyright: 'Copyright © 2026 郭子晖'
    }
  }
})
