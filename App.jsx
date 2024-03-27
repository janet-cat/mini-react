import React from "./core/react.js";

function Counter({ num }) {
  const onClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <div>counter: {num}</div>
      <button onClick={onClick}>click me</button>
    </div>
  );
}

const App = (
  <div>
    <Counter num={11}></Counter>
  </div>
);

export default App;
