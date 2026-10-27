import { useEffect, useState } from "react";
import { assignRole, getUsers } from "../api/users.api";
import { useAuth } from "../context/AuthContext";
import type { UserSummary } from "../types";

const ROLES = ["usuario", "operador", "admin"];

export function AdminUserPage() {
  const { user: me, can } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error inesperado"),
      );
  }, []);

  const handleRoleChange = async (id: string, role: string): Promise<void> => {
    setError(null);
    try {
      const updated = await assignRole(id, role);
      setUsers((current) => current.map((u) => (u.id === id ? updated : u)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto" }}>
      <h1>Usuarios</h1>
      {error !== null && <p style={{ color: "crimson" }}>{error}</p>}
      <table style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  disabled={!can("user:assign-role") || u.id === me?.id}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default AdminUserPage;
