# Vue 框架

Vue3之后，Vue2真是牛夫人 🐄，我们只聊 Vue3 吧

[官网](https://cn.vuejs.org/) 的原话是 `Vue 的核心是组件系统和数据驱动`

## 组件系统
### SFC 单文件组件
> 官网说 [single file component](https://cn.vuejs.org/guide/scaling-up/sfc) 使用熟悉的 HTML、CSS 和 JavaScript 语法编写模块化的组件

使用这么多年的感受
| 优点                                                                                  | 缺点                                                        |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 单个文件代表单个组件，逻辑都在里面，引用逻辑清晰                                      | 长文件需要滚动查看，不利于维护，IDE拆分插件的效果见仁见智了 |
| 很小的组件也独立出来，其实更有规范（有些react的开发者喜欢把很小的组件放在一个文件里） | 业务多的时候往往导致组件文件多，给人嵌套很深的感觉          |
| css Scoped 不需要考虑隔离的问题 *组件根类的命名还是要规范*                            | 一些全局的样式配置需要额外的插件和配置，比如SCSS的注入      |

### 组件通信
项目实战中，这些方式都有各自的场景，带点思考
- props/emit：单层通信，最常见；特殊： `v-model`, Vue3.5之后才算体验好
- provide/inject：Vue3.3之后的响应式才比较好用，建议readonly并暴露update，覆盖了很多EventBus的场景
- Vuex/Pinia：全局状态管理，插件系统才是其优势，比如Undo/Redo 或 Persistence（持久化缓存），慎重，🥴 个人觉得真实项目中其实并没有那么多非要放到全局Store里面的情景
- EventBus: 内存泄漏，千万记得off，没有 `$on/$emit`，可以 `mitt`
- Class-Static: 类静态属性，也算是通信吧，框架插件无关，一种来源于原生的清爽感 😄

## 数据驱动
### 响应式绑定
[深入响应式章节](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#how-reactivity-works-in-vue)里实际上讲了[观察者模式](https://www.runoob.com/design-pattern/observer-pattern.html)，里面 `track` 的举例和伪代码很清晰，学完再高度概况一下
```JS
// 0. Vue内部全局指针，执行某个方法前，比如节点渲染~ 将全局指针指向此方法
let pointer;
// 1. Proxy 代理, 这个对象没有办法知道是什么函数在访问
new Proxy(target, handler){
  get(target, prop){
    track(target, prop) // 2. 此变量被读取的时候，把当前的内部指针注册为自己观察者
    return Reflect.get(target, prop)
  }
  set(target, prop, value){
    trigger(target, prop) // 3. 此变量被修改的时候，通知所有观察者执行
    return Reflect.set(target, prop, value)
  }
}
```
| ref                                                               | reactive                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------- |
| 初衷是为了基本数据类型设计的，本身有value字段, 观察者列表也在本身 | Proxy 代理, 它注册观察者的时候注册到了一个全局Map对象上 |
| 重写get/set方法，实现了响应式                                     | 直接使用Proxy代理                                       |
```js
const [count, setCount] = useState(0)
// 读取 count 的值
console.log(count); // 0
// 修改 count 的值
setCount(10);

const flag = ref(false);
flag.value = true;
```
- 拉踩一下 react 的 useState 变量和方法看起来彼此不熟🤪
- `ref.value` 的写法其实也被诟病，学习其原理之后只能说 **强扭的瓜就是甜🥒**
- 学术点来讲，ref之后的基本数据类型其实是执行方法后返回的响应式对象，这点基本理解要有。他本身就是一个整体，也可以说`.value`并不是访问值，而是执行了他本身的 `get Value` 方法，这样更符合 **面向对象的直觉**。
- 🐢叠甲：React还是很受欢迎的，但也欢迎`getValue`  🥵进入对象内部:hot_face:


## 运行时/编译时
- 运行时框架：框架的大部分逻辑（如 Diff 算法、虚拟 DOM 渲染器）都随业务代码一起发送到浏览器中运行。
- 编译时框架：框架在编译时通过静态分析，将代码中插入或者转化为框架处理后的代码。
- vue3: 基本上时运行时框架，编译时会进行 [一些优化](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom)。
  - 缓存静态内容：将静态节点（如文本节点）提升到渲染函数顶部，整个应用只创建一次，后续渲染直接复用。
  - 树结构打平：将虚拟 DOM 树结构打平，只留下必要的节点，重新渲染时减少递归调用。
  - 补丁标记：在运行时，通过标记节点的变化类型（如添加、删除、移动），减少 Diff 算法的计算量。

## 虚拟 DOM {#virtual-dom}
一个元素的虚拟 DOM 可能长这样，在Vue中，对象命名为 `VNode`，每一个组件的渲染函数都返回一个 `VNode` 树。
```js
{
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'p', children: 'Hello World' }
  ]
}
```
组件变化的时候，生成全新的 VNode 树，然后对比之前的树，生成补丁（Patch），最后应用到真实 DOM 上。
:::info 🤖gemini
- 性能缓冲：在大量、频繁的数据更新下，通过合并多次 DOM 操作，减少浏览器的重排（Reflow）和重绘（Repaint）。
- 优秀的 [Diff 算法](#diff)（如 Vue 的双端比较、React 的 Fiber）能将复杂度从 O(n^3) 降到 O(n)。
- 只将发生变化的部分（补丁）一次性更新到真实 DOM 上，而不是重绘整个页面。
- 跨平台能力：既然是 JS 对象，它不仅可以映射到浏览器的 DOM，还可以映射到 iOS/Android 原生视图（如 React Native）或 Canvas。
- 函数式编程：让开发者只需要关注“状态”，而不需要手动调用 appendChild 或 removeChild，极大提升了开发效率。
:::

## 函数式调用 & h函数
使用过Element Plus的都会用类似MessageBox的组件，它并不想一般SFC一样引入一个组件并写到模板中，而是类似`函数式调用`。
```js
import { ElMessage } from 'element-plus'
ElMessage({
  message: '这是一条消息',
  type: 'info',
})
```
那么，这里使用`h函数`方案，就非常合适
```js
// 假设我们有一个组件 MessageComponent
import MessageComponent from './MessageComponent.vue'
import { h, render } from 'vue'

// 创建元素和挂载到 body 上
export function createMessageComponent(options) {
  const vNode = h(MessageComponent, options)
  const container = document.createElement('div')
  render(vNode, container)
  document.body.appendChild(container.firstElementChild)
}
```
Q: 为什么是firstElementChild？\
A: 因为`render`函数会返回一个`div`元素，而`div`元素只有一个子元素，就是我们的`MessageComponent`组件。借腹生子 :dog:

:::tip 优势 👍
- 不再建议使用 `Vue.prototype` 扩展全局属性，因为它会污染全局作用域，导致命名冲突和代码维护困难。
- 函数式地调用更能体现临时性
- 可以在任何地方调用，而不需要依赖 Vue 实例。比如 Vue2 中常见写法 `this.$message({ message: '这是一条消息', type: 'info' })`
:::
h函数的一些[语法示例](https://cn.vuejs.org/guide/extras/render-function.html#render-function-recipes)

### h函数相关方案积累
- 如上述的全局方法+即时性、用后销毁的组件，优势体现在方便、开发时又脱离了Vue实例的限制
- dom 工厂：可以用`h函数`创建dom元素，比如弹窗、提示框等，传给比如地图或者其他要求HTML元素的库和组件
- SFC递归调用的调用的性能消耗比较大，如果用`h函数`就可以把递归计算和组件渲染分开，性能好。
:::info 🌲树形组件例子
  - 根据树data递归`h函数`，生成树的`VNode`树，最后渲染到真实DOM上。本质上是一个组件的虚拟节点递归，而不是N个组件的递归。
  - 递归组件的每一个节点都需要自己的响应式对象（展开收起，是否选中等），而`h函数`则可以只管理一套响应式对象，还可以把展开收起、选中的状态通过ID扁平化。
:::
- HOC（高阶组件）：比如单纯包装一些属性、方法、事件等，很多时候不需要模板，有时候给屎山打补丁很有用，不必担心内部逻辑。
- component 动态组件的补充，如果有些标签化或者动态化的场景，用`h函数`可以更方便地实现。
#### ☠️ 风险
- 过度使用 `h函数` 会导致代码变得复杂，维护成本增加。或者考虑`jsx`;
- 我们在上面聊的树结构打平，模板语法可以让Vue知道哪些节点是静态的，哪些节点是动态的，而`h函数`会假定所有节点都是动态的。
- 注意要使用函数返回的Slot，处理props的时候要用 `mergeProps` 接口，防止丢失属性。

## 关于优化 & Diff 算法
- 官方优化建议: [跳转](https://cn.vuejs.org/guide/best-practices/performance.html#overview)
- 前人整理的 [vue-design](https://github.com/HcySunYang/vue-design) 项目，深入探索了虚拟dom、渲染器、diff算法、patch补丁等。相比起来这里的表述算高度概况。
- 虽然实际开发中不会用到，但是diff其实是个有趣的论点，加上框架之间的比较，我来单独开一个章节（[diff算法比较](./diff.md)）。


## 框架生态 {#ecosystem}
有一定工作经验的想必都熟悉 Vue 生态，这里就不展开讲了。倒是可以看看我对[工程化](engineer.md)的理解
:::tip 🤖TRAE 自动补全
- [Vue CLI](https://cli.vuejs.org/zh/)：官方的项目脚手架，提供了快速创建项目、配置项目、运行项目等功能。
- [Vue Router](https://router.vuejs.org/zh/)：官方的路由库，用于实现单页应用（SPA）的路由功能。
- [Vuex](https://vuex.vuejs.org/zh/)：官方的状态管理库，用于管理应用的全局状态。
- [Pinia](https://pinia.vuejs.org/zh/)：Vue 3 的状态管理库，提供了简单、灵活的 API，同时支持 SSR。
- [Element Plus](https://element-plus.org/zh-CN/)：基于 Vue 3 的组件库，提供了丰富的 UI 组件。
:::