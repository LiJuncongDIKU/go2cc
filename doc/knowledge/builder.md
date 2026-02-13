# 构建工具
构建工具的学问其实很深，除了基础的打包流程，还包括运行时通信、资源处理、插件系统等等。\
这里我们聚焦于打包的过程初步讨论

## Vite
[Vite](https://cn.vitejs.dev/) 算是后起之秀，由 Vue 作者尤雨溪在 2020 年 10 月 10 日发布的。\
它的核心思想是利用浏览器原生的 ESModule 规范，在开发时实现快速的模块热替换（HMR）。\
其核心核心包括 esbuild 和 rollup。

#### ESBuild
[ESBuild](https://esbuild.github.io/) 本身是一个基于 Go 语言实现的快速打包工具。Vite在开发模式时用它将开发文件处理成ESM模块以及实现模块热替换（HMR），速度极快。TS/JS 转译、资源加载、代码压缩、Sourcemap 生成等功能都由 ESBuild 提供。

#### Rollup
[Rollup](https://cn.rollupjs.org/) 是一个基于 ESModule 规范的打包工具。它基于 `Node.js` 实现，比 ESBuild 稍慢。\
打包时不用 ESBuild 而采用 Rollup 的核心优势：
- Tree-Shaking：Rollup 会静态分析导入的代码，并将排除所有没有实际使用的内容；
- 插件系统：Rollup 有丰富的插件系统，生态更成熟。
:::tip :package:
##### 现代模式-默认
1. Rollup 初始化并加载 esbuild 插件，由 esbuild 对源码做前置处理（TS/JSX 转译、基础语法降级，保留 ESM 模块语法）
2. 接着 Rollup 解析依赖图谱，完成 Tree Shaking 和代码拆分；
3. esbuild 对拆分后的 chunks 做极速压缩；
4. Rollup 输出符合 ESM 规范的最终产物。（全程不做 ES5 降级和多余兼容层处理）

##### 传统模式-legacy
1. 使用"legacy"后，Rollup 会在上述基础上，复用依赖图谱和chunk结构；
2. 启用Babel插件对代码进行全量ES5转译
3. 包裹 [SystemJS](./jsModule.md#sjs) 兼容层
4. 输出现代包，输出传统包
:::

#### chunk 和 bundle
| 概念 | 定义 |
| --- | --- |
| ➕ Chunk | 根据配置或代码中的 import() 语句，将模块切分为不同的 Chunk。|
| ➖ Initial Chunk | 首屏必须加载的逻辑块 |
| ➖ Async Chunk | 动态加载的逻辑块，例如懒加载 |
| ➖ Vendor Chunk | 第三方库代码，例如 Three.js 等 |
| Bundle | 构建工具对 Chunk 进行封装、哈希处理，最终输出的文件 |

:::tip 常见的构建时优化
- `manualChunks` 优化分包的逻辑，平衡大小
- Gzip 压缩：开启 Gzip 压缩可以显著减少传输文件的大小，提高加载速度。
- 开启图片内联：将图片转换为 Base64 编码，减少 HTTP 请求次数。
:::

## Webpack
[Webpack](https://webpack.js.org/) 地位很高，是目前最流行的构建工具之一。它的开发服务处理和打包处理几乎一致：
1. 初始化-读取配置-解析配置-初始化插件
2. 深度优先，遍历模块依赖图谱
3. 全量转译，将所有模块转译成 ES5 代码，需要 Loader
4. 优化和压缩：开发和生产的策略不一样
5. 打包成 Bundle, 开发时存在内存中，打包时输出到磁盘。

## Gulp
[Gulp](https://gulpjs.com/) 是一个基于 Node.js 实现的构建工具。它的核心思想是利用代码优于配置的原则，通过简单的任务定义和插件组合，实现自动化的构建流程。特点是自由度非常高，而且没有复杂的钩子和事件系统，所有的操作都是基于流（Stream）的。

> 这里有一个最简单的[任务例子](https://gulpjs.com/docs/en/getting-started/creating-tasks)

他的定位更像是rollup，本身不集成开发服务器，往往搭配[BrowserSync](https://www.browsersync.io/)或者 Vite 使用。

:::tip
换个说法更像是 Vite 的补充，与其自定义 Vite 插件不如直接使用更自由的 Gulp 。对于文件处理、媒体压缩等任务，Gulp 提供了丰富的插件生态。👍
:::