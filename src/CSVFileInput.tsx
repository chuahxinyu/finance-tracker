import Papa from "papaparse";
import { ChangeEvent, useState } from "react";
import { Row } from "./types";

export default function CSVFileInput({
  setData,
}: {
  setData: (data: Row[]) => void;
}) {
  const [isAppend, setIsAppend] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (results) => {
        // Convert Arrays to Row Objects
        const data = results.data;
        const rows: Row[] = data.map((d: unknown) => {
          const d2 = d as string[];
          const row: Row = {
            date: new Date(
              d2[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
            ),
            amount: parseFloat(d2[1]),
            description: d2[2],
            category: "Uncategorised",
            show: true,
          };
          return row;
        });
        if (isAppend) {
          const existingData = localStorage.getItem("data");
          if (existingData) {
            setData([...JSON.parse(existingData), ...rows] as Row[]);
            return;
          }
        }
        setData(rows);
      },
      header: false, // Set this to true if your CSV file has headers
      dynamicTyping: true, // Set this to true if you want PapaParse to infer types
      skipEmptyLines: true, // Set this to true to skip empty lines
    });
  };

  return (
    <div className="border-2 p-2 px-10 mb-4 bg-base-100">
      <p className="mb-2 font-semibold text-lg">CSV File Input</p>
      <input
        type="file"
        accept=".csv"
        className="file-input file-input-bordered file-input-xs w-full max-w-xs"
        onChange={(e) => handleFileChange(e)}
      />
      {/* Checkbox for appending */}
      <label className="cursor-pointer label">
        <span className="label-text text-sm">Append to current data</span>
        <input
          type="checkbox"
          checked={isAppend}
          onChange={(e) => setIsAppend(e.target.checked)}
          className="checkbox checkbox-sm"
        />
      </label>
    </div>
  );
}
