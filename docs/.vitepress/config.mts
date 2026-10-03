import { defineConfig } from 'vitepress'
import MathJax3 from 'markdown-it-mathjax3'
import { buildPostSidebar } from './utils/posts'

// 当前公网部署地址（用于站点地图与 OG 标签）
// TODO: 换成自己的域名 / Cloudflare Pages 域名后，记得同步改这里
const hostname = 'https://guozihui-tech-blog.app.workbuddy.host'

export default defineConfig({
  lang: 'zh-CN',
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

    // TODO: 注释掉的部分是「编辑此页」，等博客仓库推到 GitHub 后启用，
    // 把 my-blog 换成仓库名即可（例如 https://github.com/Neymar-10-JR/blog）
    // editLink: {
    //   pattern: 'https://github.com/Neymar-10-JR/blog/edit/main/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // },

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
