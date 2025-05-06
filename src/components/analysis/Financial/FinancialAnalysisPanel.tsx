import { useTheme } from "@emotion/react";
import { EmployeeType } from "../../../model/employee";
import {
  TetherDepositType,
  TransactionStatusType,
} from "../../../model/financial";
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
import { DepositAmountAnalysis } from "./DepositAmountAnalysis";
import { useQuery } from "@tanstack/react-query";
import { getTotalDepositAmountByStatus } from "../../../api/financial";
import { DepositShareRate } from "./DepositShareRate";
import { Decimal } from "decimal.js";

export function FinancialAnalysisPanel(props: {
  user: EmployeeType;
  depositStatus: TransactionStatusType;
  depositList: TetherDepositType[];
  selectedWallet: string;
}) {
  const { depositStatus, depositList, selectedWallet } = props;

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
    .sort((a, b) => new Decimal(b.amount).cmp(a.amount))
    .slice(0, 5);
  const amountShareRateData: SimpleFunnerChartType[] = sortedAmount.map(
    (deposit, index) => ({
      value: parseFloat(deposit.amount.toString()),
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
        (acc, d) => acc.plus(new Decimal(d.amount)), // plus() 메서드 사용
        new Decimal(0), // 초기값도 Decimal로
      );

      const average = sameDateOtherDeposits.length
        ? parseFloat(totalAmount.toString()) / sameDateOtherDeposits.length
        : 0;

      return {
        label: date,
        legendA: "선택지갑",
        legendB: "평균치",
        dataA: parseFloat(deposit.amount.toString()),
        dataB: average,
      };
    },
  );

  const { data: totalDepositsCost } = useQuery({
    queryKey: ["totalDepositsCost", depositStatus, depositList],
    queryFn: () => getTotalDepositAmountByStatus(depositStatus),
    refetchInterval: 60000,
  });

  return (
    <AnalysisContainer isWide={isWide}>
      {depositList.length !== 0 ? (
        <>
          <AnalysisContentsContainer theme={theme} width={26} isWide={isWide}>
            {totalDepositsCost ? (
              <DepositAmountAnalysis
                totalDepositsCost={totalDepositsCost}
                depositList={depositList}
                amountShare={amountShareRateData[0]}
              />
            ) : null}
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
