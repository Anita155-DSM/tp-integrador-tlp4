import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, login as loginRequest, register as registerRequest } from "../api/auth.api";
import { tokenStorage } from "../api/client";
import type { AuthUser } from "../types";

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tokenStorage.get() === null) {
            setLoading(false);
            return;
        }
        getMe()
            .then(setUser)
            .catch(() => tokenStorage.clear())
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const result = await loginRequest(email, password);
        tokenStorage.set(result.token);
        setUser(result.user);
    };

    const register = async (name: string, email: string, password: string): Promise<void> => {
        await registerRequest(name, email, password);
        await login(email, password);
    };

    const logout = (): void => {
        tokenStorage.clear();
        setUser(null);
    };

    const can = (permission: string): boolean => user !== null && user.permissions.includes(permission);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, can }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}
