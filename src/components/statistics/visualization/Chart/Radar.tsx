import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";
import { useTheme } from "@emotion/react";
import { SimpleRadarChartType } from "./ChartType";

export function SimpleRadarChart(props: {
  className?: string;
  data: SimpleRadarChartType[];
  width: number;
  height: number;
  outerRadius?: number;
}) {
  const { className, width, height, data, outerRadius = 48 } = props;
  const theme = useTheme();

  return (
    <RadarChart
      className={className}
      outerRadius={outerRadius}
      width={width}
      height={height}
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" fontSize={12} />
      <PolarRadiusAxis angle={30} domain={[0, 5]} fontSize={12} />
      <Tooltip
        wrapperStyle={{
          fontSize: 14,
          fontStyle: `${theme.mode.font.component.itemDescription}`,
        }}
      />
      <Radar
        name="평균"
        dataKey="B"
        fill={theme.mode.textPrimary}
        fillOpacity={0.4}
      />
      <Radar
        name="대상"
        dataKey="A"
        stroke={theme.mode.textAccent}
        fill={theme.mode.textAccent}
        fillOpacity={0.4}
      />
    </RadarChart>
  );
}
