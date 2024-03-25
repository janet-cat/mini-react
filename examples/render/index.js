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

// 解析方法，将vDom渲染成真实dom
function render(el, container) {
  const dom = createDOM(el.type);

  // 处理props，添加给dom
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  // 处理children
  el.props.children.forEach((child) => {
    render(child, dom);
  });

  // 将生成的dom挂载到container上
  container.append(dom);
}

const App = createElement("div", { id: "app" }, "hello");
render(App, document.querySelector("#root"));
