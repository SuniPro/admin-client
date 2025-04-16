import { createContext, ReactNode, useContext } from "react";
import { EmployeeType } from "../model/employee";
import { useQuery } from "@tanstack/react-query";
import { me } from "../api/sign";

const UserContext = createContext<{
  user: EmployeeType | null;
  isLoading: boolean;
  isError: boolean;
} | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<EmployeeType | null>({
    queryKey: ["me"],
    queryFn: () => me(),
    refetchInterval: 5000,
  });

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
