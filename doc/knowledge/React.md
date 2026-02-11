# React
:::tip 🤡说句掏心窝子的话
- React的语法跟Vue3比较的话，差异不算很大，但是从**会用**到对**掌握理解**还是需要认真对待
- React熟练程度不如Vue，相较于Vue的思考和总结，这篇就作为深入学习的笔记吧
:::
> 🔭 我打算参照Vue的结构，从组件系统和数据驱动两个大方向学习和记录React

## JSX基础：[React官网](https://zh-hans.react.dev/)
Vue也支持JSX语法，但JSX本身没有定义任何编译时或者运行时约定，只是一个XML扩展，因此React对JSX片段的处理和Vue的[略有区别](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)

| 对比 | JSX |
| --- | --- |
| 基本元素 | `return (<h1>Hello, world!</h1>)` |
| 传参 | `<h1 myAttr={name}>Hello, {name}!</h1>` |
| 表达式 | `{1 + 1}` |
| 条件渲染 | `\{isShow && <span>可见</span>\}` |
| 列表渲染 | `\{list.map(item => <li key=\{item.id\}>\{item.text\}</li>)\}` |
| 事件绑定 | `<button onClick=\{handleClick\}>点击</button>` |
| 样式绑定 | `<div style=\{\{color: 'red', fontSize: 14\}\}>行内样式</div>` |
| 类名绑定 | `<div className=\{clsx('box', \{ active: isActive \})\}>动态类</div>` |
| 自闭合标签 | `<img src=\{logo\} alt="logo" />` |
| 注释 | `\{/* 这是注释 */\}` |

## React19 组件分类
TODO