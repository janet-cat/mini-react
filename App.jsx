import React from "./core/react.js";

function Counter({ num }) {
  return <span>counter: {num}</span>;
}

const App = (
  <div>
    <span>23232</span>
    <Counter num={11}></Counter>
    <Counter num={12}></Counter>
  </div>
);

export default App;
