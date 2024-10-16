import { SupabaseUser, UserType } from "@/types";
import React, { createContext, useContext, useState } from "react";

type CombineUserOrNull = UserType | SupabaseUser | null;

type AuthContextType = {
  user: CombineUserOrNull;
  setAuth: (authUser: SupabaseUser | null) => void;
  setUserData: (userData: UserType) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CombineUserOrNull>(null);

  const setAuth = (authUser: SupabaseUser | null) => {
    setUser(authUser);
  };

  const setUserData = (userData: UserType) => {
    setUser({ ...userData });
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  return context;
};
