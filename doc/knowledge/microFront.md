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

## qiankun 方案
基于[single-spa](https://single-spa.js.org/)封装的微前端方案（:ant:蚂蚁）

- ⛰️single-spa:
  - ☮️若干个单页面应用能够与其他应用程序共存，而且它们没有各自的 html 页面。都可以响应 url 路由事件，并且必须知道如何从 DOM 中初始化、挂载和卸载自己
  - :gear: single-spa-config：配置文件，为每一个单页面应用注册：名称、加载函数、判断是否处于激活的函数
- 预先注册子应用(激活路由、子应用资源、生命周期函数)
- 监听路由的变化，精准匹配各个项目的资源，顺序调用生命周期函数并最终渲染到容器
- 实现应用隔离，完成js隔离方案 （window工厂） 和css隔离方案 （类vue的scoped）
- 增加资源预加载能力，预先子应用html、js、css资源缓存下来，加快子应用的打开速度
- TODO: 核心原理和输出

## 无界方案
🐧腾讯团队
