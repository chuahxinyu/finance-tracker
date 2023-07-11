import { useEffect, useState } from "react";

export default function DateFilter({
  filterByDate,
  recategoriseAll,
}: {
  filterByDate: (month: string, year: string) => void;
  recategoriseAll: () => void;
}) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [filterOn, setFilterOn] = useState<boolean | undefined>(undefined);

  const runFilter = (month: number, year: number, filterState?: boolean) => {
    if ((!filterOn && filterState) || (filterOn && filterState === undefined)) {
      filterByDate(month.toString(), year.toString());
    } else {
      filterByDate("", "");
    }
    recategoriseAll();
  };

  // Store filterOn in localStorage
  useEffect(() => {
    if (filterOn === undefined) return;
    localStorage.setItem("filterOn", (filterOn as boolean).toString());
  }, [filterOn]);

  // Get filterOn from localStorage
  useEffect(() => {
    const filterOn = localStorage.getItem("filterOn");
    if (filterOn) {
      setFilterOn(JSON.parse(filterOn));
    }
  }, []);

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
          onChange={(e) => {
            setMonth(parseInt(e.target.value));
            runFilter(parseInt(e.target.value), year);
          }}
          min={1}
          max={12}
        />

        <label className="label">
          <span className="label-text">Year</span>
        </label>
        <input
          type="number"
          placeholder="Year"
          className="input input-bordered input-sm"
          value={year}
          onChange={(e) => {
            setYear(parseInt(e.target.value));
            runFilter(month, parseInt(e.target.value));
          }}
          min={2022}
          max={new Date().getFullYear()}
        />

        {/* Checkmark Filter */}
        <label className="cursor-pointer label">
          <span className="label-text">Filter</span>
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => {
              setFilterOn(e.target.checked);
              runFilter(month, year, e.target.checked);
            }}
            checked={filterOn}
          />
          <span className="checkbox-mark"></span>
        </label>
      </div>
    </div>
  );
}
