import { useTheme } from "@emotion/react";
import { EmployeeType } from "../../../model/employee";
import { TetherDepositType } from "../../../model/financial";
import {
  AnalysisContainer,
  AnalysisContentsContainer,
} from "../../layouts/Layouts";
import { useWindowContext } from "../../../context/WindowContext";
import { DepositFlow } from "./DepositFlow";
import {
  SimpleBarChartType,
  SimpleFunnerChartType,
} from "../../statistics/visualization/Chart";
import { iso8601ToSummaryString } from "../../styled/Date/DateFomatter";
import { AnalysisEmptyState } from "../AnalysisEmptyState";
import { DepositAcceptRateMeter } from "./DepositAcceptRateMeter";
import { useQuery } from "@tanstack/react-query";
import { getNonApprovedDepositsByTetherWallet } from "../../../api/financial";
import { DepositShareRate } from "./DepositShareRate";

export function FinancialAnalysisPanel(props: {
  user: EmployeeType;
  depositList: TetherDepositType[];
  selectedWallet: string;
}) {
  const { depositList, selectedWallet } = props;
  const theme = useTheme();
  const { windowWidth } = useWindowContext();
  const isWide = windowWidth >= theme.windowSize.HD;

  const colors = [
    theme.colors.azureBlue,
    theme.colors.mayaBlue,
    theme.colors.babyBlue,
    theme.colors.diamond,
    theme.colors.azureishWhite,
  ];
  const sortedAmount = depositList
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const amountShareRateData: SimpleFunnerChartType[] = sortedAmount.map(
    (deposit, index) => ({
      value: deposit.amount,
      name: deposit.email.split("@")[0],
      fill: colors[index as number],
    }),
  );

  const filteredDepositList = depositList.filter(
    (deposit) => deposit.tetherWallet === selectedWallet,
  );

  const otherDeposits = depositList.filter(
    (deposit) => deposit.tetherWallet !== selectedWallet,
  );

  const depositFlowData: SimpleBarChartType[] = filteredDepositList.map(
    (deposit) => {
      const date = iso8601ToSummaryString(deposit.requestedAt);

      const sameDateOtherDeposits = otherDeposits.filter(
        (d) => iso8601ToSummaryString(d.requestedAt) === date,
      );

      const totalAmount = sameDateOtherDeposits.reduce(
        (acc, d) => acc + d.amount,
        0,
      );

      const average = sameDateOtherDeposits.length
        ? totalAmount / sameDateOtherDeposits.length
        : 0;

      return {
        label: date,
        legendA: "선택지갑",
        legendB: "평균치",
        dataA: deposit.amount,
        dataB: average,
      };
    },
  );

  const { data: nonApprovedList } = useQuery({
    queryKey: ["getNonApproved"],
    queryFn: () => getNonApprovedDepositsByTetherWallet(selectedWallet),
    refetchInterval: 10000,
    enabled: selectedWallet !== "",
  });

  const inverseRate = 10 / (nonApprovedList ? nonApprovedList.length + 1 : 0);

  return (
    <AnalysisContainer isWide={isWide}>
      {depositList.length !== 0 ? (
        <>
          <AnalysisContentsContainer theme={theme} width={26} isWide={isWide}>
            <DepositAcceptRateMeter
              starValue={null}
              circleValue={inverseRate}
            />
          </AnalysisContentsContainer>
          <AnalysisContentsContainer theme={theme} width={24} isWide={isWide}>
            <DepositShareRate data={amountShareRateData}></DepositShareRate>
          </AnalysisContentsContainer>
          <AnalysisContentsContainer theme={theme} width={50} isWide={isWide}>
            <DepositFlow data={depositFlowData}></DepositFlow>
          </AnalysisContentsContainer>
        </>
      ) : (
        <AnalysisContentsContainer width={100} theme={theme} isWide={isWide}>
          <AnalysisEmptyState />
        </AnalysisContentsContainer>
      )}
    </AnalysisContainer>
  );
}
