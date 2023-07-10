import { Row } from "./types";

export default function Table({ rows }: { rows: Row[] }) {
  const columns: string[] = ["", "Date", "Amount", "Description"];
  return (
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
          {rows.map((data, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{new Date(data.date).toLocaleDateString("en-US")}</td>
              <td>{data.amount}</td>
              <td>{data.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
