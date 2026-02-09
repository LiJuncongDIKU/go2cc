# 前端项目的工程化

## 工程化前 :thinking:
对于笔者来说，前端项目开发没有`运行时环境`是难以想象的。也许？编辑js文件、通过script标签引入JS文件，再通过浏览器打开HTML文件？调试？不过这些都是历史，可以好奇，也不必深究

## 运行时环境
- [node](https://nodejs.org/zh-cn/) 他在前端项目工程化中的 [领先地位](/knowledge/jsModule.md#node-esm) 显得一般的前端岗位中几乎一家独大，但是 `Deno` 和 `Bun` 也被大量的文章提及。
- [Deno](https://deno.land/) 常被提及由 Node.js 之父 Ryan Dahl 亲手打造，旨在修复 Node 的架构设计缺陷。也基于V8, 但不再内置 npm，`package.json` 也重新设计为 `deno.json`。
- [Bun](https://bun.sh/) 采用 Zig 语言编写，底层使用 JavaScriptCore (Apple) 而非 V8。在文件读取、网络请求、以及包安装速度上，Bun 常常比 Node.js 快数倍甚至数十倍。
  
:::details 一些深层原因，可以涉猎
- 上文提及Node的缺陷：
  - 安全：只要你运行一个 Node 程序，它就拥有你当前用户的所有权限。它可以随意读取 ~/.ssh 密钥，或者向任何服务器发送请求。可以搜索npm包被攻击的案例，每年都有。
  - `npm` 的`一根筋变成两头堵`: `npm install` 执行时，允许包运行任意的 Shell 命令。可以手动设置 `--ignore-scripts` 来禁用，但又有些包无法正常运行。
  - `npm` 早期没有官方的命名空间（Scope）强制要求。攻击者注册一个叫 cross-envv 或 lodsh（错别字）的包。如果你在命令行里手抖打错了，你就安装了恶意包。
  - `node_modules` 的默认依赖机制导致包非常大，而且早期有幽灵依赖和版本处理的问题，现在的前端项目往往使用 `yarn` 或 `pnpm` 来管理依赖。
  - 内部很多底层API的异步处理方式老旧，诞生时没有Promise、Async/Await等现代JS特性。
  - 不统一：Node 有很多自己的实现（如 Buffer、EventEmitter），这些 API 与现代浏览器环境（Web Standard）差别大
  - 如果你想编写需要高性能的 C++ 插件，Node 使用的是一个叫 `GYP` 的过时编译系统。这导致开发者在安装像 `node-sass` 这样的包时，经常因为本地环境没装 Python 或 C++ 编译器而报错。——**这个是真学到了，我不信你没遇到过。**
- Deno 也有自己的问题：
  - 一开始打算不支持 CommonJS 模块：Deno 只支持 ESM 模块，当时很快陷入生态问题。
  - 提供了安全沙箱解决上述Node的安全问题。
  - Deno 2.0 又重新拥抱了 CommonJS , 模块管理和包管理都是基于兼容的解析器，确实有丰富的功能。
  - 但是依然有生态问题并且与Webpack的兼容性比较差等等……
- Bun 也有自己的问题：
  - 深层 API 缺失： 绝大多数常用包能跑通，但在处理一些涉及底层 C++ 插件、特殊的加密算法或不常见的 Node.js 核心 API 时，Bun 仍可能崩溃。
  - 风险：同样的生态问题、兼容问题和崩溃问题。少有愿意冒险的大厂，小厂应该更少愿意吃螃蟹。
  - 穷爸爸富爸爸：Node.js 归属于 OpenJS 基金会，背后有 Microsoft、Google、IBM 等多家巨头支持。而 Bun 是由 Oven 公司 开发的商业产品。
:::
:::warning 总结
- Node.js 是依靠历史地位确实构造了比较夸张的壁垒，日常开发过程中，绕开Node选择Deno或Bun是一个具备风险的选择。
- 并且为Node配套的工具和Node不断升级自救也在继续巩固地位。
:::

## 脚手架
项目的脚手架其实应该拆分成如下几部分，我们来聊一下对目录的理解
- 运行时环境的配置-以node为例
  - `package.json` ： 项目的配置文件，包含项目的元数据、依赖项、脚本命令等。
  - `node_modules` ： 项目的依赖项，安装在项目根目录下。
  - 其他配置的目录，如 `public` 、 `dist` 等。
- 构建工具配置：从这里开始，是于运行时的包，所以上文才提到webpack与deno的不兼容问题
  - [webpack](webpack.md) ：类似`webpack.config.js`
  - [vite](vite.md) ：类似`vite.config.js`
- 现代前端或服务端框架及其解析器，这一层与构建工具和配套插件有直接的联系
  - [React](React.md)、[Vue](vue.md)、`Angular` : 流行的前端框架
  - `Next.js`、`Nuxt.js` ：服务端渲染框架
  - `Express`、`Koa` ：流行的服务端框架等等
- 代码质量工具和一些git工具
  - `eslint` ：项目的代码检查工具，用于检查项目的代码是否符合规范
  - `prettier` ：项目的代码格式化工具，用于格式化项目的代码
  - `husky` ：项目的 Git 钩子工具，git本身是分布式的，所以git的钩子处理需要一个共享配置
  - `lint-staged` ：获取暂存区的文件，避免全局检查
- 业务代码入口
  - `main.js`、`index.html` 等
- 包管理工具的配置文件等
  - `yarn.lock` ：项目的依赖项，安装在项目根目录下。
  - `pnpm-lock.yaml` ：项目的依赖项，安装在项目根目录下。
  - `package-lock.json` ：项目的依赖项，安装在项目根目录下。

