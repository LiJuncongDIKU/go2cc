# JS 五种模块化标准-基于🤖gemini 润色
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


### 2. AMD (Asynchronous Module Definition)
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
CommonJS不支持异步，浏览器`<script>`标签模块化标准化管理缺位，于是AMD诞生了。笔者上大学的时候就已经它就已经被落寞了。据了解，它大概从 2010年 开始流行，到 2015年 被 ES6 取代。
:::

### 3. CMD (Common Module Definition)
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

### 4. UMD (Universal Module Definition)
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

### 5. ES Modules (ESM)
**背景**：ES6 引入的官方标准，也是目前前端开发的绝对主流。
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

### 🏆 总结对比

| 标准 | 环境 | 加载方式 | 常用场景 |
| :--- | :--- | :--- | :--- |
| **CJS** | Node.js | 同步 | 服务端、构建工具配置 |
| **AMD** | 浏览器 | 异步 | 早期前端项目 (RequireJS) |
| **UMD** | 通用 | 自动识别 | 跨平台库/SDK (如 jQuery, Lodash) |
| **ESM** | 通用 | 静态/异步 | 现代前端项目 (Vue/React)、Vite |

**💡 面试高频点**：
- **CJS vs ESM**：CJS 导出的是值的拷贝，ESM 导出的是值的引用；CJS 是运行时加载，ESM 是编译时加载。
- **为什么现在首选 ESM？** 因为静态分析能力让打包工具（Webpack/Rollup）能更好地优化体积（Tree Shaking），且标准统一。