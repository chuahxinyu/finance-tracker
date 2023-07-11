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
      } else {
        row.show = true;
      }
    });
  };

  const calculateOpeningBalance = () => {
    if (data.length === 0) return 0;

    // If "Opening Balance" is in one of the row's description, return that row's amount
    const openingBalanceRow = data.find(
      (row) =>
        row.description.toLowerCase().includes("opening balance") && row.show
    );
    if (openingBalanceRow) return openingBalanceRow.amount;

    // Get month and year from earliest date of data that is shown
    const earliestDate = data
      .filter((row) => row.show)
      .reduce((earliestDate, row) => {
        const date = new Date(row.date);
        if (date < earliestDate) {
          return date;
        }
        return earliestDate;
      }, new Date(data[0].date));
    const month = earliestDate.getMonth() + 1;
    const year = earliestDate.getFullYear();

    const openingBalance = data
      .filter((row) => {
        const date = new Date(row.date);
        return date.getMonth() + 1 < month && date.getFullYear() <= year;
      })
      .reduce((total, row) => {
        return total + row.amount;
      }, 0);

    // Round to 2dp
    return Math.round(openingBalance * 100) / 100;
  };

  const calculateExpenses = () => {
    if (data.length === 0) return 0;

    const expenses = calculateTotal(
      data.filter((row) => row.show && row.amount < 0)
    );
    return expenses;
  };

  const calculateIncome = () => {
    if (data.length === 0) return 0;

    const income = calculateTotal(
      data.filter(
        (row) =>
          row.show && row.amount > 0 && row.description !== "Opening Balance"
      )
    );
    return income;
  };

  const calculateNet = () => {
    if (data.length === 0) return 0;

    const net = calculateIncome() + calculateExpenses();
    return Math.round(net * 100) / 100;
  };

  const calculateClosingBalance = () => {
    if (data.length === 0) return 0;

    const openingBalance = calculateOpeningBalance();
    const total = calculateTotal(data.filter((row) => row.show));
    return openingBalance + total;
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
              <div className="collapse-content flex flex-col">
                <div className="flex flex-row">
                  <CSVFileInput setData={setData} />
                  <DateFilter
                    filterByDate={filterByDate}
                    recategoriseAll={recategoriseAll}
                  />
                </div>
                <div className="bg-base-100 p-2">
                  <p>
                    Opening Balance: ${" "}
                    {calculateOpeningBalance().toLocaleString()}
                  </p>
                  {/* <p>Expenses: $ {calculateExpenses().toLocaleString()}</p>
                  <p>Income: $ {calculateIncome().toLocaleString()}</p> */}
                  <p>Net Profit/Loss: $ {calculateNet().toLocaleString()}</p>
                  <p>
                    Closing Balance: ${" "}
                    {calculateClosingBalance().toLocaleString()}
                  </p>
                </div>
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
