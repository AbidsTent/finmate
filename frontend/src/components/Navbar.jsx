import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">
          <img
            src="/assets/finmate-logo-Photoroom.png"
            alt="Finmate logo"
            className="logo-icon"
          />
          <span>FinMate</span>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/expenses"
            className={location.pathname === "/expenses" ? "active" : ""}
          >
            Expenses
          </Link>
          <Link
            to="/investments"
            className={location.pathname === "/investments" ? "active" : ""}
          >
            Investments
          </Link>
        </div>
      </div>
    </nav>
  );
}