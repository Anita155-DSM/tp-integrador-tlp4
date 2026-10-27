import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link to="/">Tickets</Link>
      <Can permission="user:read">
        <Link to="/admin/users">Usuarios</Link>
      </Can>
      <span style={{ marginLeft: "auto" }} />
      {user === null ? (
        <>
          <Link to="/login">Ingresar</Link>
          <Link to="/register">Registrarse</Link>
        </>
      ) : (
        <>
          <Can permission="notification:read">
            <NotificationBell />
          </Can>
          <span>
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout}>Salir</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
