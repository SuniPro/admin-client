import { useTheme } from "@emotion/react";
import { SimpleBarChartType } from "./ChartType";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function SimpleBarChart(props: {
  data: SimpleBarChartType[];
  width: number;
  height: number;
  fontSizeX?: number;
  fontSizeY?: number;
  barSize?: number;
  legendView?: boolean;
}) {
  const {
    data,
    height,
    barSize = 30,
    fontSizeX = 12,
    fontSizeY = 12,
    legendView = false,
  } = props;
  const theme = useTheme();

  const width = data.length * 70;

  const chartData = data.map((item) => ({
    label: item.label,
    ...(item.legendA && { [item.legendA]: item.dataA }),
    ...(item.legendB && { [item.legendB]: item.dataB }),
  }));

  // 📦 모든 legend 추출
  const legends = Array.from(
    new Set(
      data.flatMap((d) => [d.legendA, d.legendB].filter(Boolean) as string[]),
    ),
  );

  const colors = [theme.mode.textAccent, "#82ca9d", "#ffc658", "#ff7300"];

  return (
    <BarChart width={width} height={height} data={chartData}>
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="label" fontSize={fontSizeX} />
      <YAxis fontSize={fontSizeY} />
      <Tooltip />
      {legendView ? <Legend /> : null}
      {legends.map((legend, index) => (
        <Bar
          barSize={barSize}
          key={legend}
          dataKey={legend}
          fill={colors[index % colors.length]}
        />
      ))}
    </BarChart>
  );
}
