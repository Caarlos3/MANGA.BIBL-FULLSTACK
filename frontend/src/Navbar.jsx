import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, email, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/auth");
  };

  const handleLinkClick = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav>
      <div className="navbar">
        <h1>Manga-bibl</h1>

        <div
          className={`navbar-toggle ${open ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`links ${open ? "open" : ""}`}>
          <Link to="/" onClick={handleLinkClick}>
            <i className="fa-regular fa-house"></i>
          </Link>

          <Link to="/leidos" onClick={handleLinkClick}>
            <i className="fa-solid fa-book"></i>
          </Link>

          <div className="navbar-user-wrapper">
            <button
              type="button"
              className="navbar-user-button"
              onClick={handleUserClick}
            >
              <i className="fa-solid fa-user-ninja"></i>
            </button>

            {isAuthenticated && dropdownOpen && (
              <div className="navbar-user-dropdown">
                {email && <p className="navbar-user-email">{email}</p>}
                <button
                  type="button"
                  className="navbar-logout-button"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
