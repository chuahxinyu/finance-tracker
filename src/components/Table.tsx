import { useState } from "react";
import { Row } from "../types";
import useRowsStore from "../hooks/useStore";

interface TableProps {
  rows: Row[];
}

export default function Table({ rows }: TableProps) {
  const columns: string[] = ["Date", "Amount", "Description", "Category"];
  const [selectedRows, setSelectedRows] = useState<Row[]>([]);

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th></th>
            <th>
              <input
                type="checkbox"
                className="checkbox"
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelectedRows(rows);
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </th>
            {columns.map((column, i) => (
              <th key={i}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((data, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedRows.includes(data)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedRows([...selectedRows, data]);
                    } else {
                      setSelectedRows(
                        selectedRows.filter((row) => row !== data)
                      );
                    }
                  }}
                />
              </td>
              <td>{new Date(data.date).toLocaleDateString("en-US")}</td>
              <td>{data.amount}</td>
              <td>{data.description}</td>
              <td>{data.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRows.length > 0 && (
        <ActionBar
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      )}
      {/* <CategoriseModal /> */}
    </div>
  );
}

interface ActionBarProps {
  selectedRows: Row[];
  setSelectedRows: (rows: Row[]) => void;
}

const ActionBar = ({ selectedRows, setSelectedRows }: ActionBarProps) => {
  const [category, setCategory] = useState("");
  const deleteRows = useRowsStore((state) => state.deleteRows);
  const editRow = useRowsStore((state) => state.editRow);

  const editCategory = () => {
    selectedRows.forEach((row) => {
      editRow({ ...row, category });
    });
    setSelectedRows([]);
  };

  const total = selectedRows.reduce((acc, row) => acc + row.amount, 0);

  return (
    <div className="fixed bottom-0 bg-base-100 w-[100%] right-0 flex justify-end p-4 items-center z-[1000]">
      <kbd className="kbd">${total}</kbd>
      <button
        className="btn btn-accent btn-sm"
        onClick={() => setSelectedRows([])}
      >
        Deselect {selectedRows.length} rows
      </button>
      <input
        className="input input-sm input-bordered"
        placeholder="Category..."
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            editCategory();
          }
        }}
      />
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => editCategory()}
      >
        Categorise {selectedRows.length} rows
      </button>
      <button
        className="btn btn-error btn-sm"
        onClick={() => {
          deleteRows(selectedRows.map((row) => row.id));
          setSelectedRows([]);
        }}
      >
        Delete {selectedRows.length} rows
      </button>
    </div>
  );
};
