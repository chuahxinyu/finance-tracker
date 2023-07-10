import Papa from "papaparse";
import { ChangeEvent } from "react";

export default function CSVFileInput() {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (results) => {
        // Convert Arrays to Row Objects
        const data = results.data;

      },
      header: false, // Set this to true if your CSV file has headers
      dynamicTyping: true, // Set this to true if you want PapaParse to infer types
      skipEmptyLines: true, // Set this to true to skip empty lines
    });
  };
  return (
    <div className="form-control w-full border-2 p-2">
      <label className="label">
        <span className="label-text">CSV File Input</span>
      </label>
      <input
        type="file"
        accept=".csv"
        className="file-input file-input-bordered file-input-xs w-full max-w-xs"
        onChange={(e) => handleFileChange(e)}
      />
    </div>
  );
}
