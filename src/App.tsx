import { useState } from "react";
import "./App.css";
import Papa from "papaparse";

function App() {
  const [count, setCount] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
        },
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default App;
