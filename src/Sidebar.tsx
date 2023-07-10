import { useState } from "react";

interface Rule {
  name: string;
  searchFor: string;
  category: string;
  isRegex?: boolean;
}

export default function Sidebar() {
  const [rules, setRules] = useState<Rule[]>([
    {
      name: "Test",
      searchFor: "test",
      category: "test",
    },
  ]);
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
        <li className="text-xl font-semibold">
          <a>Rules</a>
        </li>
        {rules.map((rule) => (
          <div className="card bg-base-100 shadow-xl" key={rule.name}>
            <div className="card-body">
              <h2 className="card-title">{rule.name}</h2>
              <p>Search For: {rule.searchFor}</p>
              <p>Categorise to: {rule.category}</p>
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-square btn-error btn-outline">
                {/* Trash Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
