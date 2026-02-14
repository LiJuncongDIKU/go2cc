# React
:::tip 🤡说句掏心窝子的话
- React的语法跟Vue3比较的话，差异不算很大，但是从**会用**到对**掌握理解**还是需要认真对待
- React熟练程度不如Vue，相较于Vue的思考和总结，这篇就作为深入学习的笔记吧
:::
> 🔭 我打算参照Vue的结构，从组件系统和数据驱动两个大方向学习和记录React

## JSX基础：[React官网](https://zh-hans.react.dev/)
Vue也支持JSX语法，但JSX本身没有定义任何编译时或者运行时约定，只是一个XML扩展，因此React对JSX片段的处理和Vue的[略有区别](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)

| 对比       | JSX                                                                   |
| ---------- | --------------------------------------------------------------------- |
| 基本元素   | `return (<h1>Hello, world!</h1>)`                                     |
| 传参       | `<h1 myAttr={name}>Hello, {name}!</h1>`                               |
| 表达式     | `{1 + 1}`                                                             |
| 条件渲染   | `\{isShow && <span>可见</span>\}`                                     |
| 列表渲染   | `\{list.map(item => <li key=\{item.id\}>\{item.text\}</li>)\}`        |
| 事件绑定   | `<button onClick=\{handleClick\}>点击</button>`                       |
| 样式绑定   | `<div style=\{\{color: 'red', fontSize: 14\}\}>行内样式</div>`        |
| 类名绑定   | `<div className=\{clsx('box', \{ active: isActive \})\}>动态类</div>` |
| 自闭合标签 | `<img src=\{logo\} alt="logo" />`                                     |
| 注释       | `\{/* 这是注释 */\}`                                                  |

## React 的状态管理
### 基础状态
```jsx
const [count, setCount] = useState(0);
render() {
    return (
      <div>
          <p>年龄：{count}</p>
          <input type="number" value={count} 
            onChange={(e) => setCount(Number(e.target.value))} />
      </div>
  )
}
```
- 对于这个count来说，count是只读的，即使不是const解构也不应该修改，而应该通过setCount来更新
- 不存在双向绑定，在用户交互修改后应该通过 `setCount` 来更新状态
- 较于Vue，效率稍差，但更可预见，Vue的响应式丢失BUG也更难调试
- setState相当于进入一个更新队列，不会立即更新状态，后面提供回调函数可以在状态更新后执行，类似Vue的nextTick
```js
const [count, setCount] = useState(0);
setCount(count + 1, () => {
    console.log(count); // 1
});
console.log(count); // 0
```

### 复杂状态管理
```jsx
  // 相当于将setter集中管理，纯函数，写哪儿都行，也类似一个最简单的redux
  function reducer(state, action) {
    switch (action.type) {
      case 'setCount':
        // 定义各种各样的操作，必须解构state，不能直接修改state，返回新的对象性能跟setState一样
        return { ...state, count: action.payload + state.count + `乱加` };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  render() {
    return (
      <div>
        {/* 某个逻辑 */}
          <input type="number" value={state.count} 
            onChange={(e) => dispatch({type: 'setCount', payload: Number(e.target.value)})} />
      </div>
    )
  }
```
- 除了这种集中管理外，还有逻辑关联
- useMemo 类似 vue 的 computed
- useEffect 类似 vue 的 watch
:::info 渲染时拷贝了，闭包了旧值
react渲染函数执行的时候拷贝了当前的props和state，如果useEffect没有指定依赖数组的话，并不会获取到新的props和state，
后续渲染中不会更新，注意使用其他hook来更新
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 每次渲染都会打印当前的 count（快照）
  console.log('组件渲染，当前 count：', count);

  // useEffect 依赖为空 → 仅在首次渲染时执行，绑定首次快照
  useEffect(() => {
    console.log('useEffect 执行，捕获的 count：', count);
    setInterval(() => {
      // 定时器里的代码永远引用「首次渲染的 count 快照」
      console.log('定时器里的 count：', count);
    }, 1000);
  }, []); // 依赖为空，不重新执行

  return (
    <button onClick={() => setCount(c => c + 1)}>
      count: {count}
    </button>
  );
}
```
:::

## 部分订阅
> useReducer 和 useState 一样默认是全量更新，这里可能存在性能问题

我这里有一个长表单数据
```js
const dataList = [...Array(10000).fill({xxx: 'xxx'})];
```
如果我只想改动其中的一个子对象的某个字段，则需要按需求组合不同的方案
- 如果使用了循环渲染，可能需要子组件单独处理，将列表碎片化，而不是直接对dataList进行操作
- 子组件通过React.memo来缓存渲染，只有当props变化时才会重新渲染
总之 setState 是全量更新，处理大数据是大忌


TODO 后续补充