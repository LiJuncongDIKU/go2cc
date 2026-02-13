# JS 五种模块化标准
#### 基于🤖gemini+个人润色
在 JavaScript 发展的几十年里，模块化方案经历了从无到有、从社区百花齐放（CJS, AMD, CMD, UMD）到官方统一（ESM）的过程。
:::warning 这是必须的必须
不要混淆导出的标准，在遇到非标准的npm包的时候要 **从从容容，游刃有余**
:::

## CommonJS (CJS)
**背景**：由 Node.js 制定并推广，主要用于服务器端。
- **特点**：
    - **同步加载**：因为服务器文件在硬盘上，加载速度快，同步不会造成阻塞。
    - **值拷贝**：导出的是值的拷贝，一旦输出，模块内部的变化不会影响导出的值。
    - **运行时加载**：在代码运行时加载一次，且只会加载一次，并确定模块依赖关系。
- **核心语法**：
    ```javascript
    // 导出
    module.exports = { name: 'wujie' };
    // 导入
    const math = require('./math');
    ```
:::details 特点细节
> [!warning] 拷贝值的意义
> count被导出后是一个全新的变量，countModule.count和countModule.getCount()返回的是不同的变量引用
```js
// 导出
let count = 0;
module.exports = { 
  raise() { count++ }, 
  count,
  getCount() { return count }
};

// A文件导入
const countModule = require('./count.cjs');
console.log(countModule.count); // 0
console.log(countModule.getCount()); // 0
countModule.raise();
console.log(countModule.count); // 0
console.log(countModule.getCount()); // 1
```
---
> [!warning] 符合直觉 👍
> * 只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
> * 但是直接导出的变量每次都是全新的变量，不会受到缓存的影响。
> * :star:最后谨记：CJS最终目的实现的是**模块化**，注重隔离，`module.export`输出**方法**才符合原则
```JS
// 导出
let count = 0;
module.exports = { 
  raise() { count++ }, 
  count,
  getCount() { return count }
};
    
// countB.cjs
const countModule = require('./count.cjs');
module.exports = {
    raise: countModule.raise,
    count: countModule.count,
};

// A文件导入
const countModule = require('./count.cjs');
const moduleB = require('./countB.cjs');

console.log(moduleB.getCount()); // 0
moduleB.raise();
console.log(moduleB.getCount()); // 1

console.log(moduleB.count); // 0
moduleB.count++;
console.log(moduleB.count); // 1

console.log(countModule.count); // 0
console.log(countModule.getCount()); // 1
countModule.raise();
console.log(countModule.count); // 0
console.log(countModule.getCount()); // 2
```
:::


## AMD (Asynchronous Module Definition)
**背景**：由 RequireJS 提出，专门为浏览器端设计。
- **特点**：
    - **异步加载**：不阻塞浏览器渲染。
    - **依赖前置**：在定义模块时必须先声明所有依赖。
- **核心语法**：
    ```javascript
    define(['module1', 'module2'], function(m1, m2) {
      return { sayHi: () => console.log('Hi') };
    });
    // 导入
    require(['module1', 'module2'], function(m1, m2) {
      m1.sayHi(); // Hi
    });
    // 快速配置
    require.config({
        baseUrl: '/js',
        paths: {
            'module1': 'module1',
            'module2': 'module2',
        }
    });
    ```
:::info 时代的眼泪
CommonJS不支持异步，浏览器`<script>`标签模块化标准化管理缺位，于是AMD诞生了。笔者上大学的时候就已经它已经逐渐没落了。据了解，它大概从 2010年 开始流行，到 2015年 被 ES6 取代。
:::

## CMD (Common Module Definition)
**背景**：由淘宝团队玉伯提出，配合 SeaJS 使用。
- **特点**：
    - **就近依赖**：只有到需要用某个模块时才 `require`。
    - **延迟执行**：执行顺序与书写顺序一致。
- **核心语法**：
    ```javascript
    define(function(require, exports, module) {
      const m1 = require('./module1');
      // 业务逻辑...
    });
    ```
:::info 时代的眼泪2
- 核心逻辑：代码写起来像 Node.js，只有执行到 require('./a') 时才去下载并解析模块，**其实这个做法挺先进的**
- 😵‍💫调试痛苦：因为 SeaJS 是动态解析包装代码，报错时的堆栈追踪（Stack Trace）往往很难定位到原始代码位置。
- 😢前端工程化已经从加载模块脚本依赖到构建工具过度了，语法模式确实繁杂但也受限于当时的运行环境
:::
> 对于15年上大学的我来说确实没接触过，但是可以涉猎一下

## UMD (Universal Module Definition) {#umd}
**背景**：为了解决 CJS 和 AMD 在前后端环境下的兼容性问题，诞生的“万能”模板。
- **特点**：
    - **全环境兼容**：本质是一个 IIFE（立即执行函数）。
    - **逻辑检查**：先判断是否支持 CJS（`exports` 是否存在），再判断是否支持 AMD（`define` 是否存在），最后都不支持则挂载到全局 `window`。
- **核心逻辑**：
    ```javascript
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(factory); // AMD
        } else if (typeof exports === 'object') {
            module.exports = factory(); // CJS
        } else {
            root.myModule = factory(); // 全局
        }
    }(this, function () {
        return { name: 'universal' };
    }));
    ```
:::info 算是给自己加了个兼容的运行入口
- 本质上屎兼容执行环境，上述核心代码一目了然了
- 像是 `Day.js` `lodash` 这样的库，就采用了 UMD 模式，在浏览器和 Node.js 环境下都能运行。
:::

## SystemJS (SJS) {#sjs}
:::info
1. 早期 (2015-2018)：作为 模块化实验室。大家在生产环境用 Webpack，但在开发环境配合 JSPM（SystemJS 的包管理器）尝试不用打包的快感。
2. 中期 (2018-2020)：作为 微前端的基石。因为它能让不同的子应用（即便技术栈不同）在同一个页面上和谐共存。
3. 现在 (2021+)：作为 ESM 的后备方案。在 Vite 等现代工具中，它退居二线，专门负责给老旧浏览器提供 ESM 级别的模块化能力。
:::


## ES Modules (ESM) ⚒️ {#node-esm}
:::warning 有个小背景
- 2008年Google发布了V8引擎(底层C++)，卓越性能冲击了整个JS生态
- 2009年，仅一年后 `Node.js` 基于V8开发出一套服务端适用的API，不仅提升了前端本地服务开发模式，甚至JS的服务端也被考虑，当时流行`JS in everything` 的概念
- ES6以前的JS表现在模块系统上有先天不足，如循环依赖、全局污染等问题。甚至整体的写法都很落后（🐢AI这么说的，我入行的时候已经是天然ES6玩家）
- 2015年，ES6 正式发布，带来了JS的全新体系，这里我们只讨论模块系统
:::
**地位**：ES6 引入的官方标准，也是目前前端开发的绝对主流。
- **特点**：
    - **静态编译**：在代码编译阶段就能确定模块依赖，支持 **Tree Shaking**（剔除无用代码）。
    - **符号引用（值的引用）**：导入的值是指针，模块内部修改后，外部获取的值会同步变化。
    - **浏览器原生支持**：通过 `<script type="module">` 即可直接运行。
- **核心语法**：
    ```javascript
    // 导出
    export const name = 'esm';
    export default function() {};
    // 导入
    import { name } from './module.js';
    ```
---

:::details 一些细节
**状态共享**: 比拷贝值更符合直觉
```js
// 两个文件都引入同一个模块
import { increment } from './counter.js';

// componentA.js 执行
increment(); // 输出: 当前计数: 1

// componentB.js 执行
increment(); // 输出: 当前计数: 2 （状态共享）
```
**工程化的优势**
假设`counter.js`的内容如下：
```js
let count = 0;

export function increment() {
    count++;
    console.log(`当前计数: ${count}`);
}
// 这些没有被导出的函数可以依靠一些打包工具实现Tree Shaking
export function foo1() {
    console.log('foo1');
}
export function foo2() {
    console.log('foo2');
}
// 等等……
```
**静态导出值**
```js
// 假设counter中export了count变量
import { count, increment } from './counter.js';

count++; // Error: Assignment to constant variable.
/**
 * 静态导出值：导出的是值的引用，而不是值的拷贝。
 * CommonJS 导出变量的时候相当于定义了一个全新的变量并将他赋值为内部的值，该变量是全新的
 * 而ES模块导出的变量是指向内部值的引用，外部不能直接修改，无论内部是var/let/const，外部修改都会报错
 * 相当于导出的时候定义了类似的 `get value`
 */
```
:::

## ♻️循环依赖
### 先看CommonJS
```js
// a.cjs
exports.done = false;
const b = require('./b.cjs');
console.log('在 a 中，b.done =', b.done);
exports.done = true;
console.log('a 执行完毕');

// b.cjs
exports.done = false;
const a = require('./a.cjs'); // 此时 a 只运行了一半！
console.log('在 b 中，a.done =', a.done);
exports.done = true;
console.log('b 执行完毕');
```
- 分别以a和b作为入口方法执行，来对比差异
- 遇到require时，会先执行被require的模块，然后再执行当前模块
- 如果遇到的require是已经执行过的模块，会直接返回缓存的结果即使未执行完毕
```text {1,7}
< node a.cjs
> 在 b 中，a.done = false
> b 执行完毕
> 在 a 中，b.done = true
> a 执行完毕

< node b.cjs
> 在 a 中，b.done = false
> a 执行完毕
> 在 b 中，a.done = true
> b 执行完毕
```

### 再看ES Modules
- 定义两个文件
```js
// c.mjs
import { done as dDone } from './d.mjs';
export let done = false;
console.log('在 c 中，dDone =', dDone);
done = true
console.log('c 执行完毕');

// d.mjs
import { done as cDone } from './c.mjs';
export let done = false;
console.log('在 d 中，cDone =', cDone);
done = true
console.log('d 执行完毕');
```
::: danger 报错
< node d.mjs \
\> ReferenceError: Cannot access 'dDone' before initialization

- d作为入口，先加载，发现依赖声明`import { done as cDone } from './c.mjs';`
- 然后去加载c，发现依赖声明`import { done as dDone } from './d.mjs';`
- 由于d已经加载，因此不会再次加载，c因此往下执行
- 读取dDone时，发现dDone还未初始化，因此报错
:::

## 暂时性死区（Temporal Dead Zone）
这个概念其实很好理解，但是从ESM里面的循环依赖角度来看，就比较隐秘。
### 基础例子
```js {12}
/**
 * ES6 以前，var 声明的变量会提升到作用域顶部，而 let/const 不会
 * 这里相当于
 * var a;
 * console.log(a); // 输出 undefined，而不会报错
 * a = 10;
 */
console.log(a); // 输出 undefined，而不会报错
var a = 10;

console.log(b); // 报错：ReferenceError: Cannot access 'b' before initialization
let b = 10; // 这行以上的代码都是暂时性死区
```

### ESM 循环依赖导致的暂时性死区
- 和上面的var提升一样，所有import语句都会提升到作用域顶部
```js
// 0. 执行： < node c.mjs // [!code warning]
// c.mjs   1. 加载文件 // [!code warning]
import { done as dDone } from './d.mjs'; // 2. 执行依赖的文件 // [!code warning]
export let done = false; // 5. 未执行 // [!code error]
console.log('在 c 中，dDone =', dDone);
done = true
console.log('c 执行完毕');

// d.mjs
import { done as cDone } from './c.mjs'; // 3. 执行依赖的文件，d已加载往下，但未执行export // [!code warning]
export let done = false;
console.log('在 d 中，cDone =', cDone); // 4. 相当于并未定义 cDone;而造成死区 [!code error]
done = true
console.log('d 执行完毕');
```
- 从上面可以看出，报错行如果等待依赖的模块执行完毕，就不会报错我们这样修改一下
```js
// d.mjs
import { done as cDone } from './c.mjs';
export let done = false;
setTimeout(() => { // [!code ++]
  console.log('在 d 中，cDone =', cDone); 
}, 1000); // [!code ++]
done = true
console.log('d 执行完毕');
```
```bash
< node c.mjs
> d 执行完毕
> 在 c 中，dDone = true
> c 执行完毕
> 在 d 中，cDone = true # 等待了1s
```
- 或者定义改为var
```js
// c.mjs
import { done as dDone } from './d.mjs';
export let done = false; // [!code --]
export var done = false; // [!code ++]
console.log('在 c 中，dDone =', dDone);
done = true
console.log('c 执行完毕');

// d.mjs
import { done as cDone } from './c.mjs';
export let done = false;
console.log('在 d 中，cDone =', cDone);
done = true;
console.log('d 执行完毕');
```
```bash
< node c.mjs
> 在 d 中，cDone = undefined
> d 执行完毕
> 在 c 中，dDone = true
> c 执行完毕
```

## ESM的实际初始化步骤
1. 加载入口文件
2. 加载所有import语句，递归加载所有依赖的文件
3. 申请所有需要的内存（包括let/const声明的变量），建立依赖之间的连接，比如变量引用
    - 3.1 var 声明的变量会被立刻初始化，值为undefined
4. 实例化执行：深度优先、后序遍历
5. 死区：此处访问未被初始化的let/const变量会报错，类似Java的空指针

---
这里是AI的回答：
### 🚀 ESM (ES Modules) 核心运行机制总结

#### 1. 构建阶段 (Construction)
* **入口解析**：从入口文件开始，静态分析所有的 `import` 语句。
* **递归加载**：通过递归方式下载并加载所有依赖文件。
* **形成依赖图**：引擎在内存中生成一张静态的模块关系图谱（Module Record）。

#### 2. 实例化阶段 (Instantiation / Linking)
* **分配内存**：为所有 `export` 导出的变量分配内存空间（但此时不运行代码）。
* **建立符号连接 (Bindings)**：将 `import` 端指向 `export` 端的内存地址，建立“实时绑定”。
* **初始化差异**：
    * **`var` 声明**：分配内存并**立刻初始化为 `undefined`**。
    * **`function` 声明**：分配内存并**立刻初始化为完整的函数体**（提升最彻底）。
    * **`let / const` 声明**：仅分配内存，标记为 **“未初始化 (Uninitialized)”**，进入暂时性死区。

#### 3. 求值与执行阶段 (Evaluation)
* **算法顺序**：执行遵循 **深度优先、后序遍历 (Depth-First Post-Order Traversal)**。
    * **逻辑**：引擎先沿着依赖链走到最底层的叶子节点（无依赖模块），先执行子模块，最后执行父模块（入口）。
* **脱离死区**：当执行流物理上经过 `let/const` 的赋值语句时，内存空间才会被填入真实值，变量正式可用。
* **暂时性死区 (TDZ)**：在变量被初始化之前，任何读取该变量的尝试都会抛出 `ReferenceError`。
    * *类比*：类似于 Java 的空指针，但比空指针更严格——在 JS 中，未初始化前“触碰”变量名即报错。