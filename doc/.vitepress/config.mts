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
      { text: '前端技术', link: '/knowledge/index.md' },
      { text: '行业历史', link: '/history/index.md' },
      { text: '生活证据', link: '/events/index.md' }
    ],
    logo: '/assets/icons/white_cat.svg',
    search: {
      provider: 'local'
    },
    sidebar: {
      '/knowledge/': [
        {
          text: 'hello!',
          items: [
            { text: '扉页', link: '/knowledge/index.md' },
          ]
        },
        {
          text: '热门框架 & 概念',
          items: [
            { text: 'Vue', link: '/knowledge/vue.md' },
            { text: 'React', link: '/knowledge/React.md' },
            { text: 'diff 算法比较', link: '/knowledge/diff.md' },
            { text: 'hooks', link: '/knowledge/hooks.md' },
            { text: '构建工具', link: '/knowledge/builder.md' },
            { text: '微前端', link: '/knowledge/microFront.md' },
            { text: '跨端框架', link: '/knowledge/crossPlatform.md' },
            { text: 'GIT & CI/CD', link: '/knowledge/ci_cd.md' },
          ]
        },
        {
          text: '根本技术 & 标准',
          items: [
            { text: "事件循环机制", link: '/knowledge/loopEvent.md' },
            { text: "通讯协议", link: '/knowledge/protocol.md' },
            { text: "JS 模块化标准", link: '/knowledge/jsModule.md' },
            { text: 'Web Component', link: '/knowledge/webCompoment.md' },
            { text: "OAuth 2.0", link: '/knowledge/oauth.md' },
          ]
        },
        {
          text: "方案积累",
          items: [
            { text: '工程化', link: '/knowledge/engineer.md' },
            { text: "常见调优", link: '/knowledge/upgrade.md' },
            { text: "音视频处理", link: '/knowledge/media.md' },
            { text: "地图/地理行业", link: '/knowledge/geometry.md' },
            { text: "AI-概念", link: '/knowledge/AIconcept.md' },
          ]
        }
      ],
      '/history/': [
        {
          text: 'hello!',
          items: [
            { text: '扉页', link: '/history/index.md' },
          ]
        },
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
          text: 'hello!',
          items: [
            { text: '扉页', link: '/events/index.md' },
            // { text: '生活才是证据', link: '/events/life.md' },
          ]
        },
        {
          text: '镜花水月',
          items: [
            { text: '南柯一梦', link: '/events/dream.md' },
          ]
        },
        {
          text: '情真意切',
          items: [
            { text: '世界观', link: '/events/myMind.md' },
            { text: '琐碎故事', link: '/events/event.md' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LiJuncongDIKU/go2cc' }
    ]
  }
})
