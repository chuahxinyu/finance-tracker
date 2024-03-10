import { useState } from "react";
import "./App.css";
import Papa from "papaparse";
import { useLocalStorage } from "@uidotdev/usehooks";
import Select from "react-select";

const Tag = ({
  tagColoursMap,
  tag,
  onDelete,
}: {
  tagColoursMap: TagI[];
  tag: string;
  onDelete: () => void;
}) => {
  const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getColour = (tag: string) => {
    const found = tagColoursMap.find((t) => t.label === tag);
    if (found) {
      return found.colour;
    }
    return "bg-accent";
  };

  return (
    <div
      className={`${getColour(
        tag
      )} badge py-3 border-[1px] border-solid border-base-100 text-xs font-normal text-base-100`}
    >
      {capitalise(tag)}
      <button onClick={onDelete} className="btn btn-xs btn-ghost btn-square">
        X
      </button>
    </div>
  );
};

interface Row {
  [key: string]: string | number | boolean | null | TagI[];
}

interface TagI {
  value: string;
  label: string;
  colour: string;
}

function App() {
  const [data, setData] = useLocalStorage<Row[]>("data", []);
  const [tagColoursMap, setTagColoursMap] = useState<TagI[]>(
    // "tagColoursMap",
    [
      {
        value: "Housing",
        label: "🏠 Housing",
        colour: "bg-blue-400",
      },
      {
        value: "Transportation",
        label: "🚗 Transportation",
        colour: "bg-green-400",
      },
      {
        value: "Food",
        label: "🍽️ Food",
        colour: "bg-yellow-400",
      },
      {
        value: "Healthcare",
        label: "🏥 Healthcare",
        colour: "bg-purple-400",
      },
      {
        value: "Personal Care",
        label: "💅 Personal Care",
        colour: "bg-pink-400",
      },
      {
        value: "Debt Payments",
        label: "💳 Debt Payments",
        colour: "bg-red-400",
      },
      {
        value: "Entertainment",
        label: "🎉 Entertainment",
        colour: "bg-indigo-400",
      },
      {
        value: "Shopping",
        label: "🛍️ Shopping",
        colour: "bg-orange-400",
      },
      {
        value: "Education",
        label: "📚 Education",
        colour: "bg-teal-400",
      },
      {
        value: "Savings and Investments",
        label: "💰 Savings and Investments",
        colour: "bg-cyan-400",
      },
      {
        value: "Charity/Donations",
        label: "🤲 Charity/Donations",
        colour: "bg-pink-600",
      },
      {
        value: "Travel",
        label: "✈️ Travel",
        colour: "bg-yellow-600",
      },
      {
        value: "Insurance",
        label: "🛡️ Insurance",
        colour: "bg-gray-400",
      },
      {
        value: "Taxes",
        label: "📝 Taxes",
        colour: "bg-blue-600",
      },
      {
        value: "Miscellaneous",
        label: "🔀 Miscellaneous",
        colour: "bg-gray-600",
      },
    ]
  );
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
          setData(result.data as Row[]);
        },
      });

      event.target.value = "";
    }
  };

  const getColumnNames = (data: Row[]) => {
    const columnNames = data.reduce((acc, row) => {
      return [...acc, ...Object.keys(row)];
    }, [] as string[]);
    const columnNamesFiltered = new Set(columnNames);
    return Array.from(columnNamesFiltered).filter(
      (columnName) => columnName != "tags"
    );
  };

  const handleDeleteRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, i) => i));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">fincat 🐱</h1>
      <div>
        <h2>Tags</h2>
        {tagColoursMap.map((tag, index) => (
          <Tag
            tagColoursMap={tagColoursMap}
            tag={tag.label}
            onDelete={() => {
              const newTagColoursMap = tagColoursMap.filter(
                (t) => t.value !== tag.value
              );
              setTagColoursMap(newTagColoursMap);
            }}
            key={index}
          />
        ))}
      </div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
        accept=".csv"
        onChange={handleFileChange}
      />
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="checkbox"
                  onClick={() => handleSelectAllRows()}
                />
              </th>
              <th></th>
              {getColumnNames(data).map((columnName, index) => (
                <th key={index}>{columnName}</th>
              ))}
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleSelectRow(index)}
                  />
                </td>
                <td>{index}</td>
                {getColumnNames(data).map((columnName) => {
                  if (columnName == "Custom Description") {
                    return (
                      <td key={columnName}>
                        <textarea
                          className="input"
                          defaultValue={row[columnName] as string}
                        />
                        <button
                          className="btn btn-xs btn-ghost btn-square"
                          onClick={() => {
                            const newVal = (
                              document.querySelector(
                                `textarea`
                              ) as HTMLTextAreaElement
                            ).value;
                            const newRow = { ...row };
                            newRow["Custom Description"] = newVal;
                            const newData = data.map((r, i) => {
                              if (i === index) {
                                return newRow;
                              }
                              return r;
                            });
                            setData(newData);
                          }}
                        >
                          Save
                        </button>
                      </td>
                    );
                  }
                  return <td key={columnName}>{row[columnName] as string}</td>;
                })}
                <td>
                  <Select
                    options={tagColoursMap}
                    isMulti
                    onChange={(nVal, action) => {
                      console.log({ nVal, action });
                      const newVal = nVal as TagI[];
                      const newRow = { ...row };
                      newRow["tags"] = newVal;
                      const newData = data.map((r, i) => {
                        if (i === index) {
                          return newRow;
                        }
                        return r;
                      });
                      setData(newData);
                    }}
                    value={row["tags"] as TagI[]}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-xs btn-ghost btn-square"
                    onClick={() => handleDeleteRow(index)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedRows.length > 0 && (
          <div className="fixed bottom-0 p-3 bg-primary w-[100vw]">
            <button
              className="btn btn-accent"
              onClick={() => {
                const newData = data.filter(
                  (_, i) => !selectedRows.includes(i)
                );
                setData(newData);
                setSelectedRows([]);
              }}
            >
              Delete {selectedRows.length} selected rows
            </button>

            <button
              className="btn btn-accent"
              onClick={() => {
                const newData = data.map((row, i) => {
                  if (selectedRows.includes(i)) {
                    row["tags"] = tagColoursMap;
                  }
                  return row;
                });
                setData(newData);
                setSelectedRows([]);
              }}
            >
              Add tag to {selectedRows.length} selected rows
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
