# hooks
:anchor: 索性我们谈谈各种工具的分类吧

## 松散的方法
在大多数项目中，我们都会遇到各类简单的定制比如回显、校验、格式化等。这些方法通常都是独立的，不会对其他代码产生影响。
或者，很多时候我们会对 `lodash` 或者 `dayjs` 等工具库进行部分方法的二封
```js
// 拼接公司的文件服务器地址
function concatFileServerUrl(path) {
  return `${import.meta.env.VITE_FILE_SERVER_URL}${path}`
}

// 公司特定的时间和日期参数格式化
function formatCompanyDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 文件下载工具
function downloadFile(url, fileName) {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
}

// 深拷贝工具
function deepClone(obj) {
  return lodash.cloneDeep(obj)
}

// ……
```
虽然这么写没问题，但是我们可以循着规范升级一些，比如

## 工具类方法
比如我们把一个下载工具变成一个工具类，然后通过构造函数来实例化，类似一个隔离的套件，这样能实现单独控制和取消请求
```js
class myXHR {
  constructor(url, fileName) {
    this.xhr = new XMLHttpRequest()
    this.url = url
    this.fileName = fileName
    this.process = 0
  }
  downloadFile() {
    this.xhr.open('GET', this.url, true)
    this.xhr.responseType = 'blob'
    this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    this.xhr.send()
    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState === 4 && this.xhr.status === 200) {
        const blob = this.xhr.response
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = this.fileName
        a.click()
        URL.revokeObjectURL(a.href)
      }
    }
    // 监听下载进度
    this.xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        this.process = (e.loaded / e.total) * 100
      }
    }
  }
  // 取消请求
  cancelRequest() {
    this.xhr.abort()
  }
}
```
这里的目的并不是为了实现一个下载工具，而是为了展示一般function和class的写法其实各有擅长，他们会以不同的工具形式存在于项目中

## hooks
> 我们发现！上面代码中的process属性，是一个下载进度的属性，但是他并不是一个响应式对象，只是一个普通变量

以Vue3举例，它改成组合式API的一大亮点就是能够直接定义一个响应式变量，比如
```js
import { ref } from 'vue'

// 这里相当于一个class
function useDownloadFile(url, fileName) {
  // 这个process能够被直接使用
  const process = ref(0)
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const blob = xhr.response
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      a.click()
      URL.revokeObjectURL(a.href)
    }
  }
  // 监听下载进度
  xhr.onprogress = (e) => {
    if (e.lengthComputable) {
      process.value = (e.loaded / e.total) * 100
    }
  }
  return {
    process, // 响应式变量
    send: () => xhr.send(), // 手动控制
    cancelRequest: () => xhr.abort(), // 手动取消
    // 更多的，我们可以抽象出更多逻辑
    isFinish: computed(() => process.value === 100),
    isCancel: computed(() => xhr.readyState === 0),
    // ……
  }
}
```
类似的，我们CRUD项目一定会遇到的分页逻辑，也可以抽象成一个hooks
::: tip 相比于mixins，hooks的优势
1. 更清晰的代码结构，避免了 mixins 中可能出现的命名冲突和代码重复问题。
2. 更灵活的组合方式，能够根据需要动态组合多个 hooks，而不是强制要求在组件中使用特定的 mixin。
3. 更好的代码组织和维护性，能够更方便地对 hooks 进行测试和调试。
:::
```js
function usePager(apiFn) {
  const page = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const list = ref([])
  // 分页逻辑
  function getList(pageIndex) {
    page.value = pageIndex
    // 发送请求，获取数据
    // 假设apiFn是一个异步函数，返回一个Promise
    apiFn({
      page: page.value,
      pageSize: pageSize.value,
    }).then((res) => {
      // 假设返回的数据是一个数组，长度是100
      total.value = res.total
      list.value = res.list
    })
  }
  watchEffect(() => {
    getList(this.page)
  })
  return {
    page,
    pageSize,
    total,
    list,
    getList,
  }
}

```