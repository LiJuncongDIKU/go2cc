# Web Component
Web 开发往往需要复用复杂的 HTML（以及相关的样式和脚本），封装成一个 Web Component，从而实现代码的逻辑隔离和统一维护。
[MDN Web Component 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components)

:::tip 三个核心技术
- **Custom Elements（自定义元素）**：自定义新的 HTML 标签，这些标签可以在页面中直接使用，就像使用标准的 HTML 标签一样。
- **Shadow DOM（阴影 DOM）**：每个自定义元素都有自己的 DOM 树，这个 DOM 树是独立于主文档的，因此可以避免样式冲突和脚本冲突。
- **HTML Templates（HTML 模板）**：定义重复使用的 HTML 结构，这些结构可以在运行时被实例化并插入到 DOM 中。
:::

## 自定义元素（Custom Elements）
如果我们了解流行的前端框架，比如Vue.js中的组件系统，就会发现它的模板用法类似于：
```html
<popup-info
  img="img/alt.png"
  data-text="Your card validation code (CVC)
  is an extra security feature — it is the last 3 or 4 numbers on the
  back of your card."></popup-info>
```
这是一个MDN 上的实例，对应的底层API参看MDN。
@reference [Vue 与 Web Component](https://cn.vuejs.org/guide/extras/web-components)
可以知道组件系统的设计包括SFC中Template的写法就是基于自定义元素实现的。
```js
// 为当这个元素创建一个类
class PopupInfo extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
  }

  connectedCallback() {
    // 创建影子根
    const shadow = this.attachShadow({ mode: "open" });

    // 创建几个 span
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    const info = document.createElement("span");
    info.setAttribute("class", "info");

    // 获取属性内容然后将其放入 info 这个 span 内
    const text = this.getAttribute("data-text");
    info.textContent = text;

    // 插入图标
    let imgUrl;
    if (this.hasAttribute("img")) {
      imgUrl = this.getAttribute("img");
    } else {
      imgUrl = "img/default.png";
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    icon.appendChild(img);

    // 创建一些 CSS 应用于影子 DOM
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

    // 将创建好的元素附加到影子 DOM 上
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}
```

### 生命周期
| 生命周期钩子 | 触发时机 | 核心用途 (What to do) | 禁忌/注意事项 (Don'ts) |
|--------------|----------|-----------------------|-------------------------| 
| constructor | 元素被实例化（new 或 createElement 或页面解析到标签）。 | 初始化内部状态、创建 Shadow DOM。 | 禁止访问属性(attrs)、操作子节点或挂载到主 DOM 树。 |
| connectedCallback | 元素首次或再次被插入到 DOM 树中。 | 执行渲染 (Render)、发起网络请求、监听全局事件。 | 元素移动位置会重复触发，注意防范逻辑重跑。 |
| attributeChangedCallback | 监听的属性发生增加、删除、修改时。 | 响应式更新 UI、同步内部状态。 | 必须配合 static get observedAttributes 使用，否则无效。 |
| disconnectedCallback | 元素从 DOM 树中被移除（销毁）。 | 清理工作：清除定时器、解绑全局事件、销毁外部引用。 | 容易被忽略，不处理会导致内存泄漏。 |
| adoptedCallback | 元素被移动到新的文档（如 iframe 跨文档移动）。 | 处理跨文档引用、适配新的全局上下文。 | 实际开发中极少用到。 |

## 影子 DOM（Shadow DOM）
自定义元素的底层实现就是基于影子 DOM（Shadow DOM）的。他本质是一个脱离dom树的独立dom树，因此可以避免样式冲突和脚本冲突。

实例化自定义元素时，会调用构造函数，在构造函数中可以创建shadow dom根节节点。完成创建，流入主文档后，绑定到Dom树中。
::: info  创建影子DOM时，mode 有两种取值
- 只影响取值，不能作为安全策略
- `open`：表示shadow dom是开放的，主文档可以通过 `shadowRoot` 属性访问到shadow dom。
- `closed`：表示shadow dom是关闭的，主文档不能通过 `shadowRoot` 属性访问到shadow dom。
:::

同样的，作为组件系统的底层逻辑，shadow dom具有一定程度的元素隔离、样式隔离、脚本隔离的效果。
+ shadow dom 不会被document选择API选中，需要shadowRoot属性来访问。
+ shadow dom 的样式通过自定义元素的边界进行隔离。（常见做法：通过传递CSS变量实现样式的定制化）
+ 通过 `:host` 伪类可以选择自定义元素本身，从而可以在shadow dom中设置自定义元素的样式（比如：响应自定义元素实例属性的变化）。
+ 通过 `::part` 伪类可以选择自定义元素中的匹配 part 属性的元素，(理解为：自定义元素向外暴露的CSS接口)。
+ ...更多参考 [MDN 上的 Shadow DOM 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_shadow_DOM)

## template 元素 & 插槽（Slot）
HTML 模板元素（`<template>`）是一种用于定义重复使用的 HTML 结构的机制。
- 他以 `HTMLTemplateElement` 类型存在，参与DomTree，但是不会被计算到renderTree上。
- 经典用法是获取元素的content属性对象，然后将其克隆使用。

slot 元素（`<slot>`）是一种用于在自定义元素中定义占位符的机制。
```html
<!-- 定义 -->
<template id="my-element">
  <div>
    <slot name="header"></slot>
    <slot name="content"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<!-- 使用不同的元素填充不同的位置 -->
<my-element>
  <template slot="header">
    <h1>Hello, World!</h1>
  </template>
  <div slot="content">
    <p>这是内容区域。</p>
  </div>
  <my-footer slot="footer">
    <p>这是页脚区域。</p>
  </my-footer>
```


