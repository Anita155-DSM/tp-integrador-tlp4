import { Link } from "react-router";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  return (
    <nav>
      <Link to="/tickets">Tickets</Link>
      {" | "}
      <Link to="/tickets/new">Nuevo</Link>
      {" | "}
      <NotificationBell />
    </nav>
  );
}