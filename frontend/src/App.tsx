import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminUserPage } from "./pages/AdminUserPage";
import { TicketListPage } from "./pages/TicketListPage";
import { TicketFormPage } from "./pages/TicketFormPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { NotificationsPage } from "./pages/NotificationsPage";

export function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/tickets/new" element={<TicketFormPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          <Route element={<ProtectedRoute permission="user:read" />}>
            <Route path="/admin/users" element={<AdminUserPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}