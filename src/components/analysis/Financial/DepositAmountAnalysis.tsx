/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";
import { OutLine } from "../../layouts/Layouts";
import styled from "@emotion/styled";
import { useWindowContext } from "../../../context/WindowContext";
import { SimpleFunnerChartType } from "../../statistics/visualization/Chart";
import { TetherDepositType } from "../../../model/financial";
import { Decimal } from "decimal.js";

export function DepositAmountAnalysis(props: {
  totalDepositsCost: number;
  depositList: TetherDepositType[];
  amountShare?: SimpleFunnerChartType;
}) {
  const { totalDepositsCost, depositList, amountShare } = props;
  const theme = useTheme();
  const { windowWidth } = useWindowContext();
  const isWide = windowWidth >= theme.windowSize.HD;
  return (
    <OutLine
      title="입금 총계"
      css={css`
        gap: 10px;
        height: ${isWide ? 134 : 200};
      `}
    >
      <DescriptionLine
        theme={theme}
        css={css`
          margin-bottom: 10px;
        `}
      >
        <span>총 입금 금액</span>
        <span>{totalDepositsCost.toLocaleString("ko-KR")} 원</span>
      </DescriptionLine>
      <DescriptionLine
        theme={theme}
        css={css`
          color: ${theme.mode.textPrimary};
          font-size: 14px;
        `}
      >
        <span>총 입금 건수</span>
        <span>{depositList.length} 건</span>
      </DescriptionLine>
      <DescriptionLine
        theme={theme}
        css={css`
          color: ${theme.mode.textPrimary};
          font-size: 14px;
        `}
      >
        <span>최대 입금자</span>
        <span>{amountShare?.name}</span>
      </DescriptionLine>
      <DescriptionLine
        theme={theme}
        css={css`
          color: ${theme.mode.textPrimary};
          font-size: 14px;
        `}
      >
        <span>최대 입금 액수</span>
        <span>
          {amountShare?.value.toLocaleString("ko-KR")} 원 /{" "}
          {amountShare?.value &&
            depositList
              .find((deposit) =>
                new Decimal(deposit.amount).equals(
                  new Decimal(amountShare.value),
                ),
              )
              ?.usdtAmount.toString()}
          USDT
        </span>
      </DescriptionLine>
    </OutLine>
  );
}

const DescriptionLine = styled.div<{ theme: Theme }>(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    color: ${theme.mode.textAccent};
    font-family: ${theme.mode.font.component.mainTitle};
    font-size: 16px;
  `,
);
