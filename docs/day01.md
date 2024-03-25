- 今天学到了什么？

1. 由 0 实现 React.createElement 方法封装，不断贴近 react 的使用方式，这种学习方法值得反复练习，应用到自己想学的其他技术上
2. vite 如何植入项目，以前都是创建完整的项目，今天思考的点是用 vite 纯粹解决 jsx 的问题
3. vitest 接入，基础语法比较简单，有意思的是学到了 toMatchInlineSnapshot 的用法

- 遇到了哪些问题？

1. 为什么用了 vite，这段 jsx 代码`const div = <div id="app">hello</div>`，会被转成 React.createElement () 方法的形式？谁干的？
   这是因为使用的 vite 背后的 esbuild 具备解析 jsx 文件的能力，它能够根据配置将 jsx 转成普通函数的形式，这样就能被浏览器解析。那为什么 esbuild 这么聪明知道要用 React.createElement 方法呢？它不可以用别的方法吗？当然可以，它内部是根据配置项来决定用哪个方法，一共有两个配置项 jsxFactory 和 jsxFragmentFactory，vite 这里配置的 jsxFactory 的值为 React.createElement。下面 👇🏻 的这个其实就是在修改 jsxFactory 的值，将它改为 CReact.createElement。

2. `/\*_ @jsx CReact.createElement _/` 这段注释是干嘛的？
   它告诉 esbuild 当前的 jsxFactory 要使用 CReact.createElement 方法，这样编译出来的 jsx 代码就是

3. 为什么 jsx 的文件一定要导入 React？这也是一个常见的面试题。
   这是因为 esbuild 会将 jsx 编译成 React.createElement 普通函数的形式，此时这个 React 如果不引入那程序肯定会报错，这里只要理解编译前后的差异就能理解了。以后写的组件可多了，每个地方都要引入 React 确实很烦，esbuild 提供了自动引入 React 的方法 automport 配置，对应的在 vite 的中的配置我暂时没找到，再研究下...

- 怎么解决的？

1. 看了 vite 文档，看到它内部依赖了 esbuild，继续看 esbuild 文档，查阅了 jsx loader 这一章

2. @jsx 注释这个网上直接搜根本找不到，后来觉得还是 esbuild 提供的能力，就去 github
   esbuild 仓库搜索，找到一篇 2020 年的 readme 有介绍，当时为了解决一个 issue 而新增的能力，其实是 jsx 编译配置的另一种实现而已

3. 为什么 jsx 的文件一定要导入 React？这个 esbuild 文档里有介绍

- 这节课对自己有什么帮助？
  认识由繁入简的一种学习方法，有目标，但也要尽量拆解，还有一定要实操，再简单都要实操一遍，看和写出入真的很大，一看就会，一写问题就多多，但总归能柳岸花明

- 里面的哪些知识点是可以直接用到工作中的？
  vitest 值得深入学习，不说用到工作中，自己的项目中必须得用，现在前端都卷测试

- 放上你写的代码链接(让你动手)
  https://github.com/janet-cat/mini-react

## 执行过程
1. 实现`ReactDOM.createRoot(container).render(App)`这个渲染函数，container挂载容器，重点是App是一个React Element，即使用object描述的虚拟dom，数据结构为：
```js
const el = {
   type: "div",
   props: {
      id: "app",
      children: []
   }
}

// 解析方法，将vdom渲染成真是dom
function render(el, container) {
   const dom = document.createELement(el.type)
   
   // 处理props，添加给dom
   Object.keys(el.props).forEach((key) => {
     if (key !== "children") {
       dom[key] = el.props[key]
     }
   })

   // 处理children
   el.props.children.forEach(child => {
      render(child, dom)
   })

   // 将生成的dom挂载到container上
   container.append(dom)
}
```
