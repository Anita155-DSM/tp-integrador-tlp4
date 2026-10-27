import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
    permission: string;
    children: ReactNode;
}

export function Can({ permission, children }: Props) {
    const { can } = useAuth();
    return can(permission) ? <>{children}</> : null;
}
