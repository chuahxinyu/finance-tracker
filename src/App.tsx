import { useState } from "react";
import "./App.css";
import Papa from "papaparse";

const Tag = ({
  tagColoursMap,
  tag,
  onDelete,
}: {
  tagColoursMap: Record<string, string>;
  tag: string;
  onDelete: () => void;
}) => {
  const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      className={`${
        tagColoursMap && tagColoursMap[tag]
          ? tagColoursMap[tag]
          : "badge-accent"
      } badge py-3 border-[1px] border-solid border-base-100 text-xs font-normal text-base-100`}
    >
      {capitalise(tag)}
      <button onClick={onDelete} className="btn btn-xs btn-ghost btn-square">
        X
      </button>
    </div>
  );
};

interface Row {
  [key: string]: string | number | boolean | null | string[];
}

function App() {
  const [data, setData] = useState<Row[]>([]);
  const [tagColoursMap, setTagColoursMap] = useState(
    {} as Record<string, string>
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
          setData(result.data);
        },
      });
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

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
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
              <th></th>
              {getColumnNames(data).map((columnName, index) => (
                <th key={index}>{columnName}</th>
              ))}
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{index}</td>
                {getColumnNames(data).map((columnName, index) => (
                  <td key={index}>{row[columnName]}</td>
                ))}
                <td>
                  <input
                    type="text"
                    placeholder="Type tag here..."
                    className="input input-bordered w-full input-xs"
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (event.key === "Enter") {
                        const tag = (event.target as HTMLInputElement).value;
                        const newRow = { ...row };
                        if (row["tags"]) {
                          newRow["tags"] = [...(row["tags"] as string[]), tag];
                        } else {
                          newRow["tags"] = [tag];
                        }
                        const newData = data.map((r, i) =>
                          i === index ? newRow : r
                        );
                        setData(newData);

                        // Empty the input
                        (event.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  {row["tags"] &&
                    (row["tags"] as string[]).map(
                      (tag: string, tagIndex: number) => (
                        <Tag
                          tag={tag}
                          tagColoursMap={tagColoursMap}
                          onDelete={() => {
                            console.log("Deleting tag", tag, "from row", index);
                            const newRow = {
                              ...row,
                              tags: (row["tags"] as string[]).filter(
                                (t) => t !== tag
                              ),
                            };
                            const newData = data.map((r, i) =>
                              i === index ? newRow : r
                            );
                            setData(newData);
                          }}
                          key={tagIndex}
                        />
                      )
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
