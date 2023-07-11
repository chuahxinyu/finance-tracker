interface NavbarItem {
  name: string;
  children?: NavbarItem[];
  wip?: boolean;
}
const NAVBAR_ITEMS: NavbarItem[] = [];
const NAVBAR_TITLE = "💸 Financial Tracker";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        {/* Dropdown for smaller screens */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
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
        <a className="btn-ghost btn text-xl normal-case" href="/">
          {NAVBAR_TITLE}
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <NavbarItems />
        </ul>
      </div>
      <div className="navbar-end">
        <a
          className="btn"
          href="https://github.com/chuahxinyu/finance-tracker"
          target="_blank"
        >
          GitHub
        </a>
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
