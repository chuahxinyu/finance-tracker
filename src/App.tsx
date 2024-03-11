import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Rules from "./components/Rules";
import CSVFileInput from "./components/CSVFileInput";
import { Category, Row, RuleI, SortBy } from "./types";
import Table from "./components/Table";
import Charts from "./components/Charts";
import { MOCK_RULES } from "./SampleData";
import useRowsStore from "./hooks/useStore";
import {
  calculateTotal,
  calculateOpeningBalance,
  calculateExpenses,
  calculateIncome,
  calculateNet,
} from "./calculateUtils";
import { getCategories } from "./categoriesUtil";

export default function App() {
  const allRows = useRowsStore((state) => state.rows);
  const setRows = useRowsStore((state) => state.setRows);
  const [searchedRows, setSearchRows] = useState<Row[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("alphabetical");

  const [categories, setCategories] = useState<Category[]>([
    {
      name: "Uncategorised",
      rows: [],
      isInverted: false,
    },
  ]);

  // Update categories when rows change
  useEffect(() => {
    const newCategories: Category[] = getCategories(allRows);

    if (sortBy === "amount") {
      newCategories.sort((a, b) => {
        const aTotal = calculateTotal(
          a.rows.filter((row) => row.show),
          a.isInverted
        );
        const bTotal = calculateTotal(
          b.rows.filter((row) => row.show),
          b.isInverted
        );
        return Math.abs(bTotal) - Math.abs(aTotal);
      });
    } else {
      // Sort categories alphabetically but keep Uncategorised at the top
      newCategories.sort((a, b) => {
        if (a.name === "Uncategorised") return -1;
        if (b.name === "Uncategorised") return 1;
        return a.name.localeCompare(b.name);
      });
    }

    setCategories(newCategories);
  }, [allRows, setSortBy, sortBy]);

  const search = (searchInput: string) => {
    if (!searchInput || searchInput.length === 0) {
      setSearchRows([]);
      return;
    }
    const searchValue = searchInput.toLowerCase();
    const searchRows: Row[] = [];
    allRows.forEach((row) => {
      if (row.description.toLowerCase().includes(searchValue)) {
        searchRows.push(row);
      }
    });
    setSearchRows(searchRows);
  };

  const categorise = (rule: {
    name: string;
    searchFor: string;
    category: string;
  }) => {
    allRows.forEach((row) => {
      if (
        row.description.toLowerCase().includes(rule.searchFor.toLowerCase())
      ) {
        row.category = rule.category;
      }
    });
    setRows(allRows);
    setSearchRows([]);
  };

  const recategoriseAll = () => {
    // Get all rules
    const rules = localStorage.getItem("rules") || JSON.stringify(MOCK_RULES);
    const parsedRules: RuleI[] = JSON.parse(rules);

    // Uncategorise all rows
    allRows.forEach((row) => {
      row.category = "Uncategorised";
    });

    // Categorise
    parsedRules.forEach((rule) => {
      categorise(rule);
    });
  };

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="container mx-auto drawer-content flex flex-col items-center">
          <Navbar recategoriseAll={recategoriseAll} />
          <div className="mb-5 bg-primary w-[60%] w-min-[500px]">
            <div className="collapse mb-2 collapse-arrow ">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-medium text-white">
                Add/Filter
              </div>
              <div className="collapse-content flex flex-col">
                <div className="flex flex-row">
                  <CSVFileInput />
                </div>
                <Charts />
                <div className="bg-base-100 p-2">
                  <p>
                    Opening Balance: ${" "}
                    {calculateOpeningBalance(allRows).toLocaleString()}
                  </p>
                  <p>
                    Expenses: ${" "}
                    {calculateExpenses(allRows, categories).toLocaleString()}
                  </p>
                  <p>
                    Income: ${" "}
                    {calculateIncome(allRows, categories).toLocaleString()}
                  </p>
                  <p>
                    Net Profit/Loss: ${" "}
                    {calculateNet(allRows, categories).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            {/* Search Results */}
            <div className="collapse collapse-arrow mb-2">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-medium">
                Search
                <kbd className="kbd ml-5">{searchedRows.length}</kbd>
                <button
                  className={`btn float-right btn-sm ${
                    calculateTotal(searchedRows) > 0
                      ? "btn-success"
                      : "btn-error"
                  }`}
                >
                  ${calculateTotal(searchedRows).toLocaleString()}
                </button>
              </div>
              <div className="collapse-content bg-base-100">
                <Table rows={searchedRows} />
              </div>
            </div>

            {/* Sort By */}
            <select
              className="select select-bordered select-sm w-full max-w-xs"
              value={sortBy}
              onChange={(e) => setSortBy(e.currentTarget.value as SortBy)}
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="amount">Amount</option>
            </select>
            {/* Category Tables */}
            {categories.map((category, i) => {
              const showRows = category.rows.filter((row) => row.show);
              return (
                <div
                  key={i}
                  className="collapse bg-base-200 collapse-arrow mb-2"
                >
                  <input type="checkbox" />
                  <div className="collapse-title font-medium">
                    {category.name}
                    <kbd className="kbd ml-5">{showRows.length}</kbd>
                    <button
                      className={`btn float-right btn-sm ${
                        calculateTotal(showRows, category.isInverted) > 0
                          ? "btn-success"
                          : "btn-error"
                      }`}
                    >
                      $
                      {calculateTotal(
                        showRows,
                        category.isInverted
                      ).toLocaleString()}
                    </button>
                  </div>
                  <div className="collapse-content">
                    <div className="flex flex-row bg-base-100 align-middle items-center m-2">
                      <label className="cursor-pointer label">
                        <span className="label-text">Invert?</span>
                      </label>
                      <input
                        type="checkbox"
                        checked={category.isInverted}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[i].isInverted = e.target.checked;
                          setCategories(newCategories);
                        }}
                        className="checkbox"
                      />
                    </div>
                    <Table rows={category.rows} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Rules
          search={search}
          categorise={categorise}
          recategorise={recategoriseAll}
        />
      </div>
    </>
  );
}
