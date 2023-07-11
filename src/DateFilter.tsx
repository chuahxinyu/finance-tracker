import { useState } from "react";

export default function DateFilter({
  filterByDate,
  recategoriseAll,
}: {
  filterByDate: (month: string, year: string) => void;
    recategoriseAll: () => void;
}) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <div className="border-2 p-2 px-10 mb-4 bg-base-100">
      <p className="mb-2 font-semibold text-lg">Date Filter</p>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Month</span>
        </label>
        <input
          type="number"
          placeholder="Month"
          className="input input-bordered input-sm"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        />

        <label className="label">
          <span className="label-text">Year</span>
        </label>
        <input
          type="number"
          placeholder="Year"
          className="input input-bordered input-sm"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />

        {/* Checkmark Filter */}
        <label className="cursor-pointer label">
          <span className="label-text">Filter</span>
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                filterByDate(month.toString(), year.toString());
              } else {
                filterByDate("", "");
              }
              recategoriseAll();
            }}
          />
          <span className="checkbox-mark"></span>
        </label>
      </div>
    </div>
  );
}
