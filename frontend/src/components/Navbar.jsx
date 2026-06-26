import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      <h2>CareerAtlas</h2>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/">Home</Link>
        <Link to="/map">Map</Link>

        {token && user?.role === "recruiter" && (
          <Link to="/dashboard">Dashboard</Link>
        )}

        {token && user?.name && <span>Hi, {user.name}</span>}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
