import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CSVFileInput from "./CSVFileInput";
import { Category, Row, Rule } from "./types";
import Table from "./Table";
import DateFilter from "./DateFilter";

export default function App() {
  const [data, setData] = useState<Row[]>([]);
  const [searchRows, setSearchRows] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const search = (searchInput: string) => {
    if (!searchInput || searchInput.length === 0) {
      setSearchRows([]);
      return;
    }
    const searchValue = searchInput.toLowerCase();
    const searchRows: Row[] = [];
    data.forEach((row) => {
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
    data.forEach((row) => {
      if (
        row.description.toLowerCase().includes(rule.searchFor.toLowerCase())
      ) {
        row.category = rule.category;
      }
    });
    setData([...data]);
    setSearchRows([]);
  };

  const recategoriseAll = () => {
    // Get all rules
    const rules = localStorage.getItem("rules");
    if (!rules) return;
    const parsedRules: Rule[] = JSON.parse(rules);

    // Categorise
    parsedRules.forEach((rule) => {
      categorise(rule);
    });
  };

  const calculateTotal = (rows: Row[]) => {
    let total = 0;
    rows.forEach((row) => {
      total += row.amount;
    });
    // Round total to 2dp
    total = Math.round(total * 100) / 100;
    return total;
  };

  const filterByDate = (month: string, year: string) => {
    if (!month || !year) {
      // Show all rows
      data.forEach((row) => {
        row.show = true;
      });
      return;
    }
    data.forEach((row) => {
      const date = new Date(row.date);
      if (
        date.getMonth() + 1 !== parseInt(month) ||
        date.getFullYear() !== parseInt(year)
      ) {
        row.show = false;
      }
    });
  };

  // Store rows in local storage and update categories
  useEffect(() => {
    if (data.length === 0) return;
    localStorage.setItem("data", JSON.stringify(data));
    const categories: Category[] = [];
    data.forEach((row) => {
      const category = categories.find(
        (category) => category.name === row.category
      );
      if (category) {
        category.rows.push(row);
      } else {
        categories.push({
          name: row.category,
          rows: [row],
        });
      }
    });
    setCategories(categories);
  }, [data]);

  // Load rows from local storage
  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      setData(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="container mx-auto drawer-content flex flex-col items-center">
          <Navbar />
          <div className="mb-5 bg-primary ">
            <div className="collapse mb-2 collapse-arrow ">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-medium text-white">
                Add/Filter
              </div>
              <div className="collapse-content flex flex-row">
                <CSVFileInput setData={setData} />
                <DateFilter
                  filterByDate={filterByDate}
                  recategoriseAll={recategoriseAll}
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="mb-5">
            <div className="collapse collapse-arrow mb-2">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title font-medium">
                Search
                <kbd className="kbd ml-5">{searchRows.length}</kbd>
                <button
                  className={`btn float-right btn-sm ${
                    calculateTotal(searchRows) > 0 ? "btn-success" : "btn-error"
                  }`}
                >
                  ${calculateTotal(searchRows).toLocaleString()}
                </button>
              </div>
              <div className="collapse-content bg-base-100">
                <Table rows={searchRows} />
              </div>
            </div>

            {/* Category Tables */}
            {categories.map((category, i) => {
              const showRows = category.rows.filter((row) => row.show);
              return (
                <div
                  key={i}
                  className="collapse bg-base-200 collapse-arrow mb-2"
                >
                  <input type="checkbox" defaultChecked />
                  <div className="collapse-title font-medium">
                    {category.name}
                    <kbd className="kbd ml-5">{showRows.length}</kbd>
                    <button
                      className={`btn float-right btn-sm ${
                        calculateTotal(showRows) > 0
                          ? "btn-success"
                          : "btn-error"
                      }`}
                    >
                      ${calculateTotal(showRows).toLocaleString()}
                    </button>
                  </div>
                  <div className="collapse-content bg-base-100">
                    <Table rows={showRows} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Sidebar
          search={search}
          categorise={categorise}
          recategorise={recategoriseAll}
        />
      </div>
    </>
  );
}
