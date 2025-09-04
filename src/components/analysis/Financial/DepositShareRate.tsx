import { useTheme } from "@emotion/react";
import { useWindowContext } from "@/context/WindowContext";
import { SimpleFunnerChartType } from "../../statistics/visualization/Chart";
import { SimpleFunnelChart } from "../../statistics/visualization/Chart/Funnel";
import { OutLine } from "@/components/layouts";

export function DepositShareRate(props: { data: SimpleFunnerChartType[] }) {
  const theme = useTheme();
  const { windowWidth } = useWindowContext();
  const isWide = windowWidth >= theme.windowSize.HD;
  const { data } = props;
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
