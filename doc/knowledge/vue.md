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

## 虚拟 DOM
一个元素的虚拟 DOM 可能长这样
```js
{
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'p', children: 'Hello World' }
  ]
}
```
组件变化的时候，生成虚拟 DOM 树，然后对比之前的树，生成补丁（Patch），最后应用到真实 DOM 上。
:::info 🤖gemini
- 性能缓冲：在大量、频繁的数据更新下，通过合并多次 DOM 操作，减少浏览器的重排（Reflow）和重绘（Repaint）。
- 优秀的 Diff 算法（如 Vue 的双端比较、React 的 Fiber）能将复杂度从 O(n^3) 降到 O(n)。
- 只将发生变化的部分（补丁）一次性更新到真实 DOM 上，而不是重绘整个页面。
- 跨平台能力：既然是 JS 对象，它不仅可以映射到浏览器的 DOM，还可以映射到 iOS/Android 原生视图（如 React Native）或 Canvas。
- 函数式编程：让开发者只需要关注“状态”，而不需要手动调用 appendChild 或 removeChild，极大提升了开发效率。
:::