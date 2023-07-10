import { useEffect, useState } from "react";

interface Rule {
  name: string;
  searchFor: string;
  category: string;
  isRegex?: boolean;
}

export default function Sidebar({
  search,
}: {
  search: (searchInput: string) => void;
}) {
  const [rules, setRules] = useState<Rule[]>([
    {
      name: "Test",
      searchFor: "test",
      category: "test",
    },
  ]);
  const [name, setName] = useState("");
  const [searchFor, setSearchFor] = useState("");
  const [category, setCategory] = useState("");

  const addRule = () => {
    // Validate
    if (!name || !searchFor || !category) {
      alert("Please fill in all fields");
      return;
    }

    setRules([
      ...rules,
      {
        name: name,
        searchFor: searchFor,
        category: category,
      },
    ]);

    // Reset Fields
    setName("");
    setSearchFor("");
    setCategory("");
  };

  const removeRule = (name: string) => {
    setRules(rules.filter((rule) => rule.name !== name));
  };

  // Store rules in local storage
  useEffect(() => {
    if (rules.length === 0) return;
    localStorage.setItem("rules", JSON.stringify(rules));
  }, [rules]);

  // Load rules from local storage
  useEffect(() => {
    const rules = localStorage.getItem("rules");
    if (rules) {
      setRules(JSON.parse(rules));
    }
  }, []);

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
        <li className="text-xl font-semibold">
          <a>Rules</a>
        </li>
        <div className="card bg-base-100 shadow-xl mb-2">
          <div className="card-body form-control">
            <input
              type="text"
              placeholder="Name"
              className="input input-xs input-bordered"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="text"
              placeholder="Search For"
              className="input input-xs input-bordered"
              onChange={(e) => {
                search(e.target.value);
                setSearchFor(e.target.value);
              }}
              value={searchFor}
            />
            <input
              type="text"
              placeholder="Category"
              className="input input-xs input-bordered"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-sm" onClick={addRule}>
              Add
            </button>
          </div>
        </div>

        {rules.map((rule) => (
          <div className="card bg-base-100 shadow-xl mb-2" key={rule.name}>
            <div className="card-body">
              <h2 className="card-title">{rule.name}</h2>
              <p>Search For: {rule.searchFor}</p>
              <p>Categorise to: {rule.category}</p>
            </div>
            <div className="card-actions justify-end">
              <button
                className="btn btn-error btn-sm"
                onClick={() => removeRule(rule.name)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
