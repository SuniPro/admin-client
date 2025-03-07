import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // const password = "mypassword123"; // ✅ 감지될 가능성 높음
  const API_KEY = "sadfaksdmiiidfngkermasdfd"; // ✅ 감지될 가능성 높음

  return (
    <>
      <p>{API_KEY}</p>
      <div>
        <a href="https://vite.dev" target="_blank"></a>
        <a href="https://react.dev" target="_blank"></a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
