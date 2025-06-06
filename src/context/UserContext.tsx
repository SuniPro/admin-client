import { createContext, ReactNode, useContext, useEffect } from "react";
import { EmployeeType } from "../model/employee";
import { useQuery } from "@tanstack/react-query";
import { me } from "../api/sign";
import { useNavigate } from "react-router-dom";

const UserContext = createContext<{
  user: EmployeeType | null;
  isLoading: boolean;
  isError: boolean;
} | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<EmployeeType | null>({
    queryKey: ["me"],
    queryFn: () => me(),
    refetchInterval: 5000,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  return (
    <UserContext.Provider value={{ user: user ?? null, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within the context");
  }

  return context;
}
