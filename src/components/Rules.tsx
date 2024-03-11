import { useEffect, useState } from "react";
import { RuleI } from "../types";
import { MOCK_RULES } from "../SampleData";

const Rule = ({
  rule,
  removeRule,
  saveRule,
}: {
  rule: RuleI;
  removeRule: (name: string, searchFor: string) => void;
  saveRule: (rule: RuleI) => void;
}) => {
  const [searchFor, setSearchFor] = useState(rule.searchFor);
  const [category, setCategory] = useState(rule.category);

  return (
    <div className="card bg-base-100 shadow-xl mb-2" key={rule.name}>
      <div className="card-body">
        <h2 className="card-title">{rule.name}</h2>
        <div className="flex">
          <p>Search For:</p>{" "}
          <input
            type="text"
            className="input input-xs input-bordered"
            value={searchFor}
            onChange={(e) => setSearchFor(e.target.value)}
          />
        </div>
        <div className="flex">
          <p>Categorise to:</p>{" "}
          <input
            type="text"
            className="input input-xs input-bordered"
            defaultValue={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>
      <div className="card-actions justify-end">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            saveRule({ ...rule, searchFor, category });
          }}
          disabled={searchFor === rule.searchFor && category === rule.category}
        >
          Save
        </button>
        <button
          className="btn btn-error btn-sm"
          onClick={() => removeRule(rule.name, rule.searchFor)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default function Rules({
  search,
  categorise,
  recategorise,
}: {
  search: (searchInput: string) => void;
  categorise: (rule: RuleI) => void;
  recategorise: () => void;
}) {
  const [rules, setRules] = useState<RuleI[]>(MOCK_RULES);
  const [name, setName] = useState("");
  const [searchFor, setSearchFor] = useState("");
  const [category, setCategory] = useState("");

  const addRule = () => {
    // Validate
    if (!searchFor || !category) {
      alert("Please fill in all fields");
      return;
    }
    const newRule = {
      name: name || searchFor,
      searchFor: searchFor,
      category: category,
    };

    setRules([...rules, newRule]);

    // Reset Fields
    setName("");
    setSearchFor("");
    setCategory("");

    // Categorise
    categorise(newRule);
  };

  const removeRule = (name: string, searchFor: string) => {
    setRules(rules.filter((rule) => rule.name !== name));
    const uncategoriseRule = {
      name: "",
      searchFor: searchFor,
      category: "Uncategorised",
    };
    categorise(uncategoriseRule);
  };

  const saveRule = (rule: RuleI) => {
    setRules(
      rules.map((r) => {
        if (r.name === rule.name) {
          return rule;
        }
        return r;
      })
    );
    recategorise();
  };

  // Store rules in local storage
  useEffect(() => {
    if (rules.length === 0 || rules === MOCK_RULES) return;
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
      <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
        <li className="text-xl font-semibold">
          <a>Rules</a>
        </li>
        <button
          className="btn btn-block btn-sm btn-primary mb-2"
          onClick={recategorise}
        >
          Recategorise All
        </button>
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
          <Rule
            rule={rule}
            removeRule={removeRule}
            saveRule={saveRule}
            key={rule.name}
          />
        ))}
      </ul>
    </div>
  );
}
