"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define Auth Context Type
interface AuthContextType {
  user: {
    name: string;
    email: string;
    role: "admin" | "superadmin";
    isLoggedIn: boolean;
  };
  setUser: (user: AuthContextType["user"]) => void;
}

// Create Context with Default Values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>({
    name: "",
    email: "",
    role: "admin",
    isLoggedIn: false,
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for Easy Access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
