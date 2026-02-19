import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="logo">GraphSentinal</div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
          </li>
           <li>
            <NavLink to="/fileinput" end className={linkClass}>
              Input
            </NavLink>
          </li>
          <li>
            <NavLink to="/graph" className={linkClass}>
              Graph
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/pricing" className={linkClass}>
              Pricing
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
