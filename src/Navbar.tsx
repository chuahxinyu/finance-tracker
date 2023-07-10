interface NavbarItem {
  name: string;
  children?: NavbarItem[];
  wip?: boolean;
}
const NAVBAR_ITEMS: NavbarItem[] = [];
const NAVBAR_TITLE = "Financial Tracker";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        {/* Dropdown for smaller screens */}
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <NavbarItems />
          </ul>
        </div>
        <a className="btn-ghost btn text-xl normal-case">{NAVBAR_TITLE}</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <NavbarItems />
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">GitHub</a>
      </div>
    </div>
  );
}

function NavbarItems() {
  return (
    <>
      {NAVBAR_ITEMS.map((item, i) => (
        <li key={i} className={item.wip ? `disabled` : ``}>
          {item.children && !item.wip ? (
            <details>
              <summary>{item.name}</summary>
              <ul className="p-2">
                {item.children.map((child, i) => {
                  return (
                    <li
                      key={i}
                      className={item.wip || child.wip ? `disabled` : ``}
                    >
                      <a>{child.name}</a>
                    </li>
                  );
                })}
              </ul>
            </details>
          ) : (
            <a>{item.name}</a>
          )}
        </li>
      ))}
    </>
  );
}
