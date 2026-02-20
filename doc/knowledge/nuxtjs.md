## Nuxt.js {#nuxtjs}

> [Nuxt](https://nuxt.com.cn/docs/4.x/getting-started/introduction) 是一个免费且开源框架，以直观和可扩展的方式，基于 Vue.js 创建类型安全、高性能且适用于生产环境的完整堆栈网页应用和网站。

### 理解项目结构
```txt
|- .nuxt # 开发过程中的Vue应用，nuxt dev 的时候整个目录会重新创建
|- .output # build输出结果
|- app # 类似src
    |- assets # 用于存放资源，如样式、字体等
    |- components # 组件目录，用于存放Vue组件
    |- composables # 可组合函数目录，hooks
    |- layouts # 布局目录，配合NuxtLayout、definePageMeta使用
    |- middleware # 中间件目录，其作用类似路由守卫
    |- pages # 页面目录，Nuxt根据目录结构自动生成路由
    |- plugins # 插件目录，留意命名规则和顺序
    |- utils # 会被自动引入的工具目录
    |- app.vue # 入口组件
    |- error.vue # 错误组件
    |- app.config.ts # 暴露配置和环境变量：useAppConfig
|- content # 内容目录，用于存放静态内容，如Markdown文件 @nuxtContent
|- modules # 模块目录，用于存放自定义模块
|- node_modules # 依赖目录，存放项目依赖的Node.js模块
|- public # 静态资源目录，区别于app/assets跳过构建
|- server # 注册 API 和服务端handler，可能要考虑代理服务器中间件的问题
|- shared # 共享目录，Vue 应用和 Nitro 服务端之间共享功能
|- .env # 环境变量文件，用于存放环境变量
|- .gitignore # Git忽略文件，用于指定Git忽略的文件和目录
|- .nuxtignore # Nuxt忽略文件，用于指定Nuxt忽略的文件和目录
|- .nuxtrc # Nuxt全局配置，会被 nuxt.config.ts 覆盖
|- nuxt.config.ts # Nuxt配置文件，用于配置Nuxt的行为
|- package.json # Node.js包配置文件，用于指定项目的依赖和脚本
|- tsconfig.json # TypeScript配置文件，用于配置TypeScript的行为
```
### 水合不匹配（Hydration Mismatch）
> 问题：在客户端渲染时，HTML 与服务器返回的内容不一致，导致渲染错误。

```txt {5}
// 水合过程-客户端初始化时保持与服务器端状态一致
1. 客户端请求页面
2. 服务器渲染并返回 HTML + 序列化状态 + JS 资源链接
3. 客户端接收 HTML 并解析，发现序列化状态
4. 客户端执行 JS 资源，恢复状态
5. 客户端完成水合过程，页面交互正常
```
:::tip 关键
1. vue 的 ref 或其他响应式数据，只会在vue内部即客户端渲染时生效
2. 使用useState类似的函数，则可以执行3、4步
3. 序列化通过window.__NUXT__ 传递给客户端
:::

### 其他概念
#### 🏃Nitro 
这是一个Nuxt内置的服务端渲染引擎，用于处理服务器端渲染（SSR）和静态站点生成（SSG）。它负责将 Vue 应用程序转换为静态 HTML 文件或动态服务器响应，以提供更好的性能和搜索引擎优化（SEO）。

#### 📁nuxtContent
内置的内容管理系统，用于处理静态内容，如Markdown文件。
- Markdown 文件中直接使用 Vue 组件
- 允许nuxt通过API查询文件和内容
- 内置引用、列表组件

