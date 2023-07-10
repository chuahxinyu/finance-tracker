import Papa from "papaparse";
import { ChangeEvent } from "react";
import { Category, Row } from "./types";

export default function CSVFileInput({
  setData,
}: {
  setData: (data: Category[]) => void;
}) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (results) => {
        console.log(results);
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
          };
          return row;
        });
        console.log(rows);

        // Convert Rows to Categories via Rules
        // TODO

        // Uncategorised Rows
        const uncategorised: Category = {
          name: "Uncategorised",
          rows: rows,
        };
        setData([uncategorised]);
      },
      header: false, // Set this to true if your CSV file has headers
      dynamicTyping: true, // Set this to true if you want PapaParse to infer types
      skipEmptyLines: true, // Set this to true to skip empty lines
    });
  };
  return (
    <div className="form-control border-2 p-2 px-10 mb-4">
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
