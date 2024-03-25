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

let root = null;
let nextUnitOfWork = null;
function render(el, container) {
  // el：React VDom ; container：根节点
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };

  root = nextUnitOfWork;
}

function createDOM(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = (nextUnitOfWork.dom = createDOM(fiber.type));

    updateProps(dom, fiber.props);
  }

  initChildren(fiber);

  // 4. 返回下一个workUnit
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;
  return fiber.parent.sibling;
}

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;

  fiber.parent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  if (deadline.timeRemaining() > 1 && nextUnitOfWork) {
    // 同步获取到下一个节点
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && root) {
    commitRoot();
    root = null;
  }

  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
