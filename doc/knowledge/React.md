# React
:::tip 🤡说句掏心窝子的话
- React的语法跟Vue3比较的话，差异不算很大，但是从**会用**到对**掌握理解**还是需要认真对待
- React熟练程度不如Vue，相较于Vue的思考和总结，这篇就作为深入学习的笔记吧
:::

## [官网](https://zh-hans.react.dev/)的快速入门：JSX
Vue也支持JSX语法，但JSX本身没有定义任何编译时或者运行时约定，只是一个XML扩展，因此React对JSX片段的处理和Vue的[略有区别](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
| 对比 | JSX | Vue模板语法 |
| --- | --- | --- |
| 定义元素 | `const element = <h1>Hello, world!</h1>` | `const element = <h1>Hello, world!</h1>` |
