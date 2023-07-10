import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CSVFileInput from "./CSVFileInput";
import { Category, Row } from "./types";
import Table from "./Table";

export default function App() {
  const [rows, setRows] = useState<Row[]>([]);
  const [data, setData] = useState<Category[]>([]);

  // Store rows in local storage
  useEffect(() => {
    if (data.length === 0) return;
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  // Load rows from local storage
  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      setRows(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="container mx-auto drawer-content flex flex-col items-center">
          <Navbar />
          <CSVFileInput setData={setData} />
          <div>
            {data.map((category, i) => (
              <div key={i} className="collapse bg-base-200 collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  {category.name}
                  <kbd className="kbd ml-5">{category.rows.length}</kbd>
                </div>
                <div className="collapse-content bg-base-100">
                  <Table rows={category.rows} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
