/** @jsxImportSource @emotion/react */
import "rsuite/dist/rsuite.css";
import { CryptoDepositSendList } from "../../components/list/financial/CryptoDepositSendList";
import { useEmployeeContext } from "../../context/UserContext";
import { CryptoDepositList } from "@/components/list/financial/CryptoDepositList";

export function CryptoDeposit() {
  const { employee } = useEmployeeContext();

  if (!employee) return;

  return (
    <>
      <CryptoDepositSendList employee={employee} />
      <CryptoDepositList employee={employee} />
    </>
  );
}
