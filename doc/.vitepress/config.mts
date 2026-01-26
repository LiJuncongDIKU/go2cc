import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/go2cc/',
  title: "GO2CC",
  description: "行业知识",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/go2cc/assets/icons/white_cat.svg' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: '前端技术', link: '/knowledge/webCompoment.md' },
      { text: '行业历史', link: '/history/turing.md' },
      { text: '生活证据', link: '/events/index.md' }
    ],
    logo: '/assets/icons/white_cat.svg',

    sidebar: {
      '/knowledge/': [
        {
          text: '热门框架 & 概念',
          items: [
            { text: '微前端', link: '/knowledge/microFront.md' },
          ]
        },
        {
          text: '根本技术 & 标准',
          items: [
            { text: 'Web Component', link: '/knowledge/webCompoment.md' },
          ]
        }
      ],
      '/history/': [
        {
          text: '行业历史',
          items: [
            { text: '历史巨人', link: '/history/turing.md' },
            { text: '计算机革命', link: '/history/computer.md' },
          ]
        }
      ],
      '/events/': [
        {
          text: '生活证据',
          items: [
            // { text: '生活才是证据', link: '/events/life.md' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiJuncongDIKU/go2cc' }
    ]
  }
})
