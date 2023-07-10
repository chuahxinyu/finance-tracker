import { useState } from "react";
import Navbar from "./Navbar";

export default function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(["", ""]);
  return (
    <>
      <main className="container mx-auto">
        {/* Navbar */}
        <Navbar />
        {/* Sidebar */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
