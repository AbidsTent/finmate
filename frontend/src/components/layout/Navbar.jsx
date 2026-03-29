import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">
          <span>Finmate</span>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/investments">Investments</NavLink>
        </div>
      </div>
    </nav>
  );
}