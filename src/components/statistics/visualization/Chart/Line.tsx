import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SimpleLineChartType } from "./ChartType";
import { useTheme } from "@emotion/react";

export function SimpleLineChart(props: {
  data: SimpleLineChartType[];
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
    <LineChart
      width={width}
      height={height}
      data={chartData}
      accessibilityLayer
    >
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="label" fontSize={fontSizeX} />
      {/*<XAxis dataKey="name" padding={{ left: 30, right: 30 }} />*/}
      <YAxis fontSize={fontSizeY} />
      <Tooltip />
      {legendView ? <Legend /> : null}
      {legends.map((legend, index) => (
        <Line
          type="monotone"
          key={legend}
          dataKey={legend}
          fill={colors[index % colors.length]}
        />
      ))}
      <Line type="monotone" dataKey="EVEN" stroke="#82ca9d" />
    </LineChart>
  );
}

export function MovingAverageChart() {
  const data = [
    { round: 219, result: 0, movingAvg: 0.2 },
    { round: 218, result: 1, movingAvg: 0.4 },
    { round: 217, result: 0, movingAvg: 0.3 },
    { round: 216, result: 0, movingAvg: 0.25 },
    { round: 215, result: 0, movingAvg: 0.2 },
    { round: 214, result: 0, movingAvg: 0.15 },
  ];
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="round" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="result" stroke="#8884d8" />
      <Line type="monotone" dataKey="movingAvg" stroke="#82ca9d" />
    </LineChart>
  );
}
