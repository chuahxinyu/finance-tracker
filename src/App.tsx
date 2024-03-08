import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
      />
    </div>
  );
}

export default App;
