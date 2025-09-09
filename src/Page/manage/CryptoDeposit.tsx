import "rsuite/dist/rsuite.css";
import { CryptoDepositSendList } from "../../components/list/financial/CryptoDepositSendList";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { CryptoDepositList } from "@/components/list/financial/CryptoDepositList";
import { SiteWalletInfoList } from "@/components/list/financial/SiteWalletInfoList";
import { HorizontalDivider } from "@/components/layouts";
import { useQuery } from "@tanstack/react-query";
import { getSiteWalletInfoBySite } from "@/api/site";

export function CryptoDeposit() {
  const { employee } = useEmployeeContext();

  const { data: siteWalletInfoList } = useQuery({
    queryKey: ["getDepositByAddressAndRangeAndSite"],
    queryFn: () => getSiteWalletInfoBySite(),
    refetchInterval: 1800000,
  });

  if (!employee) return;

  return (
    <>
      {siteWalletInfoList && (
        <SiteWalletInfoList siteWalletInfoList={siteWalletInfoList} />
      )}
      <HorizontalDivider width={100} />
      <CryptoDepositSendList employee={employee} />
      <CryptoDepositList employee={employee} />
    </>
  );
}
