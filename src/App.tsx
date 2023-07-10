import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CSVFileInput from "./CSVFileInput";

interface Row {
  date: Date;
  amount: number;
  description: string;
}

export default function App() {
  const [rows, setRows] = useState<Row[]>([]);
  const columns: string[] = ["", "Date", "Amount", "Description"];
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="container mx-auto drawer-content flex flex-col items-center">
          <Navbar />
          <CSVFileInput />
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  {columns.map((column, i) => (
                    <th key={i}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr></tr>
              </tbody>
            </table>
          </div>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
