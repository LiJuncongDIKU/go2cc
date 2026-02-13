# 跨端框架
uni-app和Taro 有实战经验，其他框架基于进行了学习和尝试。

## [uni-app](https://uniapp.dcloud.io/)
dCloud 提供的一直整套跨端解决方案，包括 Android、iOS、H5、小程序 等多个平台。\
它的核心思想是基于 Vue2/Vue3 框架，通过简单的配置和插件扩展，实现跨平台的开发。

| 平台    | 支持                                                                                                                                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Android | 将默认基座或者自定义基座（apk）安装到 Android 设备上，通过`adb.exe` 调试。完成后允许本地打包、云打包（常被诟病），提供 UTS 作为第三方SDK的快速二封装桥... |
| ...     | 各端的配置和需要注意的地方非常多，建议查看官网                                                                                                            |

## [Taro](https://docs.taro.zone/docs/)
京东提供的跨端框架，支持使用 React/Vue/Nerv 等框架来开发 微信 / 京东 / 百度 / 支付宝 / 字节跳动 / QQ / 飞书 / 快手 小程序 / H5 / RN / ASCF元服务 等应用。
不同点在于它的安卓编译是先转换成react native，再编译成apk。开发框架到产出的指向比较复杂（多对多），文档不如uni-app完善。

## [React Native](https://reactnative.dev/)
同React一样，是 facebook 出品，但是它的目标不是h5，而是移动端的应用。正因为出身海外，它**不支持小程序！！！**很多公司选型没办法使用react native。仅支持 Android/iOS/Web 平台。
// TODO

## [Flutter](https://flutter.dev/)
Google 提供的跨端框架，支持使用 Dart 语言来开发 Android/iOS/Web 应用。
Flutter 是 Google 推出的跨平台 UI 开发框架，核心目标是用一套代码，高效构建高性能、高保真的移动端（iOS/Android）、桌面端（Windows/macOS/Linux）、Web 端甚至嵌入式设备的应用。

#### 优势
- 性能强：采用自绘引擎（Skia），流畅度接近原生，无 JS 桥接损耗，支持高帧率
- 跨端广：一套代码支持 iOS、Android、Web、Windows、macOS、Linux
- UI 统一：多端界面高度一致，动画效果好，定制能力极强
- 开发效率高：热重载极快，组件丰富，生态成熟
- 稳定性好：Google 官方维护，大厂广泛使用，版本稳定
#### 劣势
- 不支持小程序，这是很多业务无法选用的关键原因
- 需学习 Dart 语言，上手成本比 Vue 系框架高
- 安装包体积比 RN、uni-app 更大
- 默认风格偏 Material，原生系统风格需要额外适配
- 原生插件接入比 Web 系框架更复杂

## [Electron](https://www.electronjs.org/)
Electron 它专注于桌面应用，Windows/macOS/Linux。但是渲染交互部分完全使用了Web的技术栈。
其内核由两部分组成：
- Chromium：Google 开源浏览器项目，负责渲染 Web 页面。V8 引擎 + Blink 内核。
- Node.js：基于 V8 引擎的 JavaScript 运行环境，负责处理系统级 API 调用、文件操作、网络请求等。

#### 多窗口模型
在 Chromium 中为了不让一个页面的崩溃影响其他页面，每个页面都运行在一个独立的进程中。在这个基础上，Electron 还引入了主进程和渲染进程的概念。
- 主进程：负责管理应用的生命周期、创建窗口、处理系统事件等。--node
- 渲染进程：负责渲染 Web 页面，与 Chromium 内核交互。--chromium

#### 集成现代Web 框架
项目中的进程创建和管理都有API，这和React和Vue3非常类似
```js
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```
基于 vue-cli-plugin-electron-builder，我们可以很方便地将 Vue 项目打包成 Electron 应用。开发过程也基本一致。