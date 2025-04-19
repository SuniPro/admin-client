/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { OutLine } from "../../layouts/Layouts";
import { SimpleLineChart } from "../../statistics/visualization/Chart/Line";
import { SimpleLineChartType } from "../../statistics/visualization/Chart";

export function DepositFlow(props: { data: SimpleLineChartType[] }) {
  const { data } = props;
  return (
    <OutLine
      alignItems="flex-start"
      css={css`
        gap: 14px;
        overflow-x: scroll;
        overflow-y: hidden;
      `}
    >
      <SimpleLineChart width={800} height={150} data={data}></SimpleLineChart>
    </OutLine>
  );
}
