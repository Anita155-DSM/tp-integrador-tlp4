import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

interface Props {
    children?: ReactNode;
    permission?: string;
}

export function ProtectedRoute({ children, permission }: Props) {
    const { user, loading, can } = useAuth();

    if (loading) {
        return <p>Cargando...</p>;
    }
    if (user === null) {
        return <Navigate to="/login" replace />;
    }
    if (permission !== undefined && !can(permission)) {
        return <p>No tenés permiso para ver esta página.</p>;
    }
    return children !== undefined ? <>{children}</> : <Outlet />;
}
