# 微前端
构建一个能够让多个团队独立交付功能的现代 Web 应用程序的技术、策略和方法。
::: tip [微前端](https://micro-frontends.org/)
Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently. 
  -- Micro Frontends
:::

@reference [无极](https://wujie-micro.github.io/doc/guide/)
- 通俗来说，就是在一个web应用中可以独立的运行另一个web应用
- 比如制作一个企业管理平台，把已有的采购系统和财务系统统一接入这个平台；
- 比如有一个巨大的应用，为了降低开发和维护成本，分拆成多个小应用进行开发和部署，然后用一个平台将这些小应用集成起来；
- 又比如一个应用使用vue框架开发，其中有一个比较独立的模块，开发者想尝试使用react框架来开发，等模块单独开发部署完，再把这个模块应用接回去

::: warning 个人理解
大型项目要达到SPA的效果和用户体验，并且考虑业务模块、开发团队的独立性，需要在整个系统的高级架构上进行设计和实现。比如单点登录、路由管理、状态管理等等。\
说白了就是太大了 :hot_face: 需要从用户体验角度和项目管理（包括技术管理、团队管理、沟通管理等）角度考虑。
:::

## 原始 iframe 方案
- 实现：最基础的方案，就是在主应用中嵌入一个iframe，指向子应用的url，几乎零学习成本
- 性能:small_red_triangle_down:：在一个网页内嵌入另一个网页实际上是一个完整的加载流程，包括HTML、CSS、JS、图片等资源的加载和解析。
- 通信：
  - 单次/刷新：URL参数可以传递简单的参数
  - 同源：父:arrow_right:子：iframe的contentWindow属性直接访问或操作
  - 同源：子:arrow_right:父：parent对象可以访问或操作父应用的DOM元素
  - 通用：postMessage + addEventListener 可以实现跨域通信
  - :question: 后续谈谈流行框架的通信系统本质
- 体验：
  - iframe 的边界可能导致某些布局下元素无法在“使用上觉得是一体的”，某些toast\modal等元素可能会被遮挡/限制
  - 实现某些业务的时候，需要父子项目协调代码

:::danger @reference qiankun技术圆桌
[为什么不推荐使用 iframe 方案？](https://www.yuque.com/kuitos/gky7yw/gesexv)
:::

## qiankun 方案 {#single-spa}
基于[single-spa](https://single-spa.js.org/)封装的微前端方案（:ant:蚂蚁）

### 基础项目 ⛰️single-spa:
  - ☮️若干个单页面应用能够与其他应用程序共存，而且它们没有各自的 html 页面。都可以响应 url 路由事件，并且必须知道如何从 DOM 中初始化、挂载和卸载自己
  - :gear: single-spa-config：配置文件，为每一个单页面应用注册：名称、加载函数、判断是否处于激活的函数
### 路由
  - 📝预先注册子应用(激活路由、子应用资源、生命周期函数)
  - 🔗监听路由的变化，精准匹配各个项目的资源，顺序调用生命周期函数并最终渲染到容器
  - 👬提供手动API为页面同时渲染不同应用内容提供可能
### JS隔离方案 
  - 🏭window工厂为每个子应用创建fake Window对象，隔离全局变量和函数, 属性取值先本身后全局(默认方案)
  - 🥬兼容旧浏览器的SnapshotSandbox，切换应用的时候对比window对象的差异，记录并切换（性能差）:small_red_triangle_down:
  - ♦️单例方案，LegacySandbox，直接修改全局 window，但会通过三个变量池（新增、修改、原始值）来记录这些变化，切换应用时会对比差异并恢复原始值，性能一般，更像是snapshot的升级版
### CSS 隔离方案
  - 🔒Strict Sandbox: 使用Web Component的Shadow DOM来实现样式隔离，每个子应用都有自己的独立作用域，防止样式冲突
    :::danger 注意
    很多 React/Vue 的 UI 组件库（如 Ant Design 或 Element UI）的 Modal、Popover 等弹窗默认是挂载到 document.body 下的。由于这些弹窗脱离了 Shadow DOM 容器，会导致样式丢失。
    :::
  - :card_index_dividers:Scoped CSS: 为每个子应用的样式添加一个唯一的前缀，类似vue的scoped
    ```css
      div[data-qiankun="app1"] .p { color: red; }
    ```

### 效果体现：打包和部署
- 主应用打包：
  - 与一般的单页面应用打包类似，必须包含`qiankun`的相关代码，确保能够正确加载和运行子应用
  - 打包产物就是 `index.html` 和一堆 `bundle.js`。
- 子应用打包：
  - 子应用不需要包括`qiankun`的相关代码，注意输出、允许跨域、public路径
  - UMD：主应用在加载子应用时，会通过 `fetch` 获取 JS 脚本，然后通过 eval 执行，并从中提取出 `mount` 等生命周期函数。
  ```js
  // 子应用 webpack.config.js
  module.exports = {
    output: {
      library: `micro-app-name`, // 应用名称
      libraryTarget: 'umd',      // 必须打包成 umd 格式
      jsonpFunction: `webpackJsonp_micro-app-name`, // 防止多个子应用 chunk 冲突
    }
  }
  ```
  ### 子应用渲染判断 {#sub-app-render}
  - 子应用入口处理、生命周期改造，需要定义 `render` 函数，暴露给主应用，同时判断是否作为微应用运行，保持独立部署的能力
  ```js:line-numbers {7-18}
  import './public-path'; // 必须在第一行引入，用于动态设置 publicPath
  import { createApp } from 'vue';
  import App from './App.vue';

  let instance = null;

  function render(props = {}) {
    const { container } = props;
    instance = createApp(App);
    // 如果是作为微应用运行，渲染到 qiankun 提供的容器内；
    // 否则渲染到 id 为 app 的节点
    instance.mount(container ? container.querySelector('#app') : '#app');
  }

  // 独立运行时直接渲染
  if (!window.__POWERED_BY_QIANKUN__) {
    render();
  }

  /**
  * 暴露给主应用的生命周期钩子
  */
  export async function bootstrap() {
    console.log('子应用 bootstrap');
  }

  export async function mount(props) {
    console.log('子应用 mount', props);
    render(props); // 接收主应用传来的 props 进行渲染
  }

  export async function unmount() {
    console.log('子应用 unmount');
    instance.unmount();
    instance = null;
  }
  ```

## 无界方案
🐧腾讯团队：wujie的[学习文档](https://wujie-micro.github.io/doc/guide/) :monocle_face: 
有学习路径和功能特性 \
qiankun就写个[TODO](https://qiankun.umijs.org/zh/guide#%E5%AE%83%E6%98%AF%E5%A6%82%E4%BD%95%E5%B7%A5%E4%BD%9C%E7%9A%84), 还得从[single-spa](#single-spa)了解设计思想 😫

### 1. 打包后的本质
总结了qiankun的学习过程，发现从打包结果上更能体现微前端框架的本质作用，也更便于后续框架核心原理的理解

#### 主应用
- 主应用打包：与qiankun类似，必须包含`wujie`的相关代码，结果基本上也是流行的标准的应用资源。
- 打包产物也是 `index.html` 和一堆 `bundle.js`。
#### 子应用
- :ballot_box_with_check:子应用打包不需要像 qiankun 那样打包成 UMD 格式
- :ballot_box_with_check:子应用不需要做[生命周期改造](#sub-app-render) （[单例模式](#core-mode)除外）
- :ballot_box_with_check: 打包产物也是 `index.html` 和一堆 `bundle.js`。可以直接部署。

### 2. 核心运行模式 {#core-mode}
#### 👻保活模式
- 子应用 `alive:true` ，使用 [webcomponent](./webCompoment.md) 保活，存留在内存中
- 即使被切换走了仍能响应 bus 事件
- 封装的Wuji组件挂载后，`url` 变化不会生效，需要采用 `通信` 的方式对子应用路由进行跳转
  ```vue {2-3}
  <WujieVue
    :url="xxx"
    :sync="true" 
    :fetch="fetch"
    ...
  ></WujieVue>
  ```
- :arrows_counterclockwise:`sync` 是值得一提的参数（同步路由模式）<br/>
   `https://xxx.com/parentPage?childAppName=childPath` \
  观察这个url，子应用的路由会被同步到父应用的路由上，导致前进后退不能作用到子应用，但是刷新页面和直接访问子应用的url是可以的，反之，关闭时子路由会被清除，但是前进后退可以作用到父应用，应该根据实际应用配置或者想办法通过缓存做兼容

#### 单例模式
- 子应用 `alive:false` 且进行了[生命周期改造](#sub-app-render)时，作为单例模式。
- 所谓单例
  - 多个相同 `name` 的子应用会共享一个实例
  - 子应用切走，会调用`window.__WUJIE_UNMOUNT`销毁实例，子应用切换回来,会调用`window.__WUJIE_MOUNT`渲染新实例
- 组件封装的`url`参数能够达到路由响应`prop`的效果

#### 重建模式
- 子应用 `alive:false` ，也没有进行生命周期的改造
- 销毁子应用的 `web component` 实例，也销毁 `iframe`
- 组件封装的`url`参数能够达到路由响应`prop`的效果，但会被 [`sync`](#core-mode) 覆盖。

### 3. JavaScript 隔离机制
- 使用iframe 作为容器，相较与fake window对象，省略了切换、记录、恢复、清理的机制

### 4. DOM/CSS 隔离机制
- [web component](./webCompoment.md) 的 `shadow DOM` 隔离了 DOM 作用域和CSS样式

#### 5. 通信方式 {#communication-mode}
- **Props/\$wujie 传递**：主应用通过 `props` 向微应用传递初始化数据，子应用通过 `$wujie` 接收
- **window 同域共享**： 👎缺乏事件机制
    ```js
    // 父应用获取子应用的属性
    window.document.querySelector("iframe[name=子应用id]").contentWindow.xxx;
    // 子应用获取父应用的属性
    window.parent.xxx;
    ```
- **eventBus**：事件总线
  ```js
  // 主应用直接获取bus
  import { bus } from "wujie";
  // 子应用从$wujie获取bus
  const bus = window.$wujie?.bus;
  // bus.$on | bus.$emit | bus.$off
  ```

### 无界是如何解决或者给这些问题封装方案的？
:::warning @reference qiankun技术圆桌
[为什么不推荐使用 iframe 方案？](https://www.yuque.com/kuitos/gky7yw/gesexv)

- url 不同步: 提供 [sync](#core-mode) 的同步模式
- UI 不同步：wujie将js放到iframe中，但是会在主应用下创建web component,JS隔离而dom可以挂载到主应用下
- 全局上下文共享：参考[通讯方式](#communication-mode)
- iframe慢：有[保活模式](#core-mode)、资源预加载、包依赖优化等
  - `preloadApp` 预加载: `requestIdleCallback` 将提前加载所需的静态资源
    - `exec` 参数开启预执行，提前渲染
      - `fiber` 参数将每一个文件都放进`requestIdleCallback`解析成一个 fiber 节点，可以通过配置拆包提高收益
  - 父子包共享策略
    - 将公用包挂载到主应用的 `window` 对象上，子应用可通过 `externals` 引用，并在子应用中使用 `window.parent.xxx` 访问
    - `jsBeforeLoaders` 插件引入等
::: 


:::tip 🚩Flag 回收
经过上方学习，qiankun/wujie的通信系统也呼之欲出：
无论基于fake Window/还是iframe对象，通用的通信系统都是基于事件总线的。
:::

## 无界 vs Qiankun
:::tip 叠甲🐢 
这是AI对比的 不是我
:::

| 特性 | 无界 | Qiankun |
|------|------|---------|
| 轻量级 | ✅ 核心体积 < 20KB | ❌ 体积较大 |
| 启动速度 | ✅ 更快的应用切换速度 | ⚠️ 相对较慢 |
| 兼容性 | ✅ 更好的浏览器兼容性 | ⚠️ 依赖现代浏览器特性 |
| 配置复杂度 | ✅ 简洁的 API 设计 | ❌ 配置项较多 |
| 功能完备性 | ⚠️ 聚焦核心功能 | ✅ 功能更丰富 |



