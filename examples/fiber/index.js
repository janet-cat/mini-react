function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextElement(child) : child
      ),
    },
  };
}

function createDOM(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

// nextUnitOfWork 记录当前正在处理的的dom节点
let nextUnitOfWork = null;
// 解析方法，将vDom渲染成真实dom
function render(el, container) {
  // 初始化nextUnitOfWork
  nextUnitOfWork = {
    dom: container,
    parent: nextUnitOfWork,
    props: {
      children: [el],
    },
  };
  //   const dom = createDOM(el.type);

  //   // 处理props，添加给dom
  //   Object.keys(el.props).forEach((key) => {
  //     if (key !== "children") {
  //       dom[key] = el.props[key];
  //     }
  //   });

  //   // 处理children
  //   el.props.children.forEach((child) => {
  //     render(child, dom);
  //   });

  //   // 将生成的dom挂载到container上
  //   container.append(dom);
}

function performUnitOfWork(work) {
  console.log(
    "%c [ work ]-60",
    "font-size:13px; background:pink; color:#bf2c9f;",
    work
  );
  if (!work.dom) {
    const dom = (work.dom = createDOM(work.type));

    // 处理当前dom的props
    Object.keys(work.props).forEach((key) => {
      if (key !== "children") {
        dom[key] = work.props[key];
      }
    });

    work.parent.dom.append(dom)
  }

  // 构建链表
  const children = work.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newWork = {
        type: child.type,
        props: child.props,
        parent: work,
        sibling: null,
        child: null,
        dom: null
    }
    if (index=== 0) {
        work.child = newWork
    } else {
        prevChild.sibling = newWork
    }
    prevChild = newWork
  })

  // 返回下一个节点
  if (work.child) return  work.child
  if (work.sibling) return work.sibling
  return work.parent?.sibling // 可能没有parent，也可能没有sibling节点，说明链表已经到头了，遍历结束
}

function workLoop(deadline) {
  while (deadline.timeRemaining() > 1 && nextUnitOfWork) {
    // do something sync block
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop);

const h1 = createElement("h1", null, "");
const App = createElement("div", { id: "app" }, h1, "123");
render(App, document.querySelector("#root"));
