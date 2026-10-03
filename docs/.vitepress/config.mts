import { defineConfig } from 'vitepress'
import MathJax3 from 'markdown-it-mathjax3'
import { buildPostSidebar } from './utils/posts'

// TODO: 部署到 Cloudflare Pages 后把这里换成真实域名（用于站点地图与 OG 标签）
const hostname = 'https://gzh-blog.pages.dev'

export default defineConfig({
  lang: 'zh-CN',
  title: '郭子晖的技术博客',
  titleTemplate: ':title | 郭子晖',
  description: '后端工程、检索增强生成（RAG）与论文阅读笔记',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'author', content: '郭子晖' }],
    ['meta', { name: 'keywords', content: '后端开发,RAG,Milvus,Spring Boot,Redis,人工智能,广州大学' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '郭子晖的技术博客' }],
    ['meta', { property: 'og:description', content: '后端工程、检索增强生成（RAG）与论文阅读笔记' }],
    ['meta', { property: 'og:url', content: hostname }]
  ],

  sitemap: { hostname },

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

    // TODO: 部署后取消下面三行注释，并把 YOUR_NAME / YOUR_REPO 换成真实仓库，
    // 即可在每篇文章底部显示「在 GitHub 上编辑此页」。
    // editLink: {
    //   pattern: 'https://github.com/YOUR_NAME/YOUR_REPO/edit/main/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // },

    socialLinks: [
      // TODO: 换成你自己的链接
      // { icon: 'github', link: 'https://github.com/YOUR_NAME' },
      // { icon: { svg: '<svg .../>' }, link: 'https://scholar.google.com/citations?user=YOUR_ID', ariaLabel: 'Google Scholar' }
    ],

    footer: {
      message: '内容基于 CC BY-NC-SA 4.0 发布，转载请注明出处。',
      copyright: 'Copyright © 2026 郭子晖'
    }
  }
})
