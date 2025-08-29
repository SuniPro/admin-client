import { CryptoAccountList } from "../../components/Tether/CryptoAccountList";
import { useEmployeeContext } from "../../context/UserContext";

export function CryptoAccount() {
  const { employee } = useEmployeeContext();

  if (!employee) return;

  return <CryptoAccountList employee={employee} />;
}
