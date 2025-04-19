import { Funnel, FunnelChart, LabelList, Tooltip } from "recharts";
import { SimpleFunnerChartType } from "./ChartType";

export function SimpleFunnelChart(props: {
  data: SimpleFunnerChartType[];
  width: number;
  height: number;
}) {
  const { data, width, height } = props;

  return (
    <FunnelChart width={width} height={height}>
      <Tooltip />
      <Funnel dataKey="value" data={data} isAnimationActive>
        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
      </Funnel>
    </FunnelChart>
  );
}
