import { useTheme } from "@emotion/react";
import { useWindowContext } from "../../../context/WindowContext";
import { SimpleFunnerChartType } from "../../statistics/visualization/Chart";
import { SimpleFunnelChart } from "../../statistics/visualization/Chart/Funnel";
import { OutLine } from "../../layouts/Layouts";

export function DepositShareRate(props: { data: SimpleFunnerChartType[] }) {
  const { windowWidth } = useWindowContext();
  const theme = useTheme();
  const { data } = props;
  const isWide = windowWidth >= theme.windowSize.HD;
  return (
    <OutLine title="입금 점유율 비교">
      <SimpleFunnelChart
        data={data}
        width={isWide ? 300 : 400}
        height={isWide ? 134 : 200}
      />
    </OutLine>
  );
}
