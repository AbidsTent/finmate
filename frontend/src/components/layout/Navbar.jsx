import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getUser, isLoggedIn } from "../../utils/storage";
import finmateLogo from "../../assets/finmate.png";
export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">
          <img src={finmateLogo} alt="Finmate logo" className="logo-icon" />
          <span>Finmate</span>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-links">
          {isLoggedIn() ? (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/expenses">Expenses</NavLink>
              <NavLink to="/investments">Investments</NavLink>
              <span className="muted" style={{ marginLeft: "10px" }}>
                {user?.name}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}