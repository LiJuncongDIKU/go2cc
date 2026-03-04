# 优化方案和调试技巧
## SSR / SSG
SSR（Server-Side Rendering）和 SSG（Static Site Generation）都是优化网站性能的重要手段。
| 服务端渲染 | 静态站点生成 |
| ---------- | ------------ |
| 每次请求都在服务器端渲染页面 | 构建时在服务器端渲染页面 |
| 页面内容永远是最新的，适合内容经常变动的场景。 | 页面内容是静态的，适合内容不经常变动的场景。 |
| 响应时间相对长 | 响应时间快 |
| 对服务器负载高 | 对服务器负载低 |

我的 [Nuxt.js](./vue.md#nuxtjs) 笔记

## PWA（Progressive Web App）
PWA（渐进式 Web 应用）是一种将 Web 技术与本地应用的体验结合在一起的技术。它允许用户在移动设备上安装应用，提供类似本地应用的体验。
### CacheApi
> Cache 接口为缓存的 Request / Response 对象对提供存储机制，例如，作为ServiceWorker 生命周期的一部分。请注意，Cache 接口像 workers 一样，是暴露在 window 作用域下的。尽管它被定义在 service worker 的标准中，但是它不必一定要配合 service worker 使用。
PWA 的实现依赖于 CacheApi，它允许在浏览器中缓存资源，包括 HTML、CSS、JavaScript 等。——[MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache_API/)

当现代浏览器发起请求的时候，会先检查 CacheApi 中是否有缓存的响应。如果有，直接返回缓存的响应；如果没有，才会发送请求到服务器。这个过程优先级高于Http本地缓存。

### ServiceWorker
他是特殊的 Worker，他能够被注册到浏览器中，用于在后台运行，监听网络请求和响应。
- 📶 有网络的时候
  - ServiceWorker被注册并运行，注册会安装到客户端（可理解为浏览器）中
  - 其他请求：执行 CacheApi 操作，缓存
- ⛔ 断网的时候
  - 浏览器解析链接地址时检查本地注册的 ServiceWorker，如果有，激活代理
  - ServiceWorker 激活后，从 CacheApi 中检查缓存的响应
  - 此后，ServiceWorker 作为代理、或者理解成虚拟服务器使得资源加载正常

### 其他功能
ServiceWorker 作为注册到浏览器的线程，除了拦截请求和缓存响应之外，可以依靠浏览器达到以下功能：
- 接收服务器推送消息：没打开网站，但浏览器进程运行中，也可以接收服务器推送的消息
- 弹出系统级通知
- 网络恢复后自动补发请求：在网络恢复时将需要提交的请求自动补发
- 定期在后台更新内容
- 安装到桌面：用户可以将 PWA 安装到桌面，像本地应用一样使用，允许图标、通知等