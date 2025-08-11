import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">Karyakit</div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
            About
          </Link>
        </li>
        <li>
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/signup" className={location.pathname === "/signup" ? "active" : ""}>
            Signup
          </Link>
        </li>
        <li>
          <Link to="/tasks" className={location.pathname === "/tasks" ? "active" : ""}>
            Tasks
          </Link>
        </li>
      </ul>
    </nav>
  );
}
