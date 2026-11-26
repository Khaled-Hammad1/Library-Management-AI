import { NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  return (
    <ul>
      <li>
        <NavLink to="/" end>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/items">Items</NavLink>
      </li>
      <li>
        <NavLink to="/members">Members</NavLink>
      </li>
      <li>
        <NavLink to="/borrowing">Borrowing</NavLink>
      </li>
      {token ? (
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      ) : (
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      )}
    </ul>
  );
}
