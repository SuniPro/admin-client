import { createContext, ReactNode, useContext, useEffect } from "react";
import { EmployeeInfoType } from "../model/employee";
import { useQuery } from "@tanstack/react-query";
import { check } from "../api/sign";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeContext = createContext<{
  employee: EmployeeInfoType | null;
  isLoading: boolean;
  isError: boolean;
} | null>(null);

export function EmployeeContextProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const location = useLocation();
  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery<EmployeeInfoType | null>({
    queryKey: ["check"],
    queryFn: () => check(),
    refetchInterval: 300000,
    enabled: !location.pathname.includes("login"),
  });

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  return (
    <EmployeeContext.Provider
      value={{ employee: employee ?? null, isLoading, isError }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useUserContext must be used within the context");
  }

  return context;
}
