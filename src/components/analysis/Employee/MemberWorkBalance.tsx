/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { OutLine } from "../../layouts/Layouts";
import {
  SimpleBarChart,
  SimpleBarChartType,
} from "../../statistics/visualization/Chart";

export function MemberWorkBalance(props: { data: SimpleBarChartType[] }) {
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
      <SimpleBarChart data={data} width={800} height={150}></SimpleBarChart>
    </OutLine>
  );
}
