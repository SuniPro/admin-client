import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
} from "chart.js";
import { ChartDefaultOptions, SimpleMixedChartType } from "./ChartType";
import { Chart } from "react-chartjs-2";

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

/** Line 과 Bar 가 함께 있는 기본 혼합차트입니다. */
export function SimpleMixedChart(props: SimpleMixedChartType) {
  const getChartDataSet = (chartData: SimpleMixedChartType) => ({
    labels: chartData.labels, // ✅ 전체 공통 labels
    datasets: [
      {
        type: "bar" as ChartType,
        label: chartData.barLabels,
        data: chartData.barData,
        backgroundColor:
          chartData.barBackgroundColor ?? "rgba(255, 99, 132, 0.2)",
        borderColor: chartData.barBorderColor ?? "rgba(255, 99, 132, 1)",
        borderWidth: chartData.barBorderWidth ?? 1,
      },
      {
        type: "line" as ChartType,
        label: chartData.lineLabels,
        data: chartData.lineData,
        borderColor: chartData.lineBorderColor ?? "rgba(54, 162, 235, 1)",
        border: chartData.lineBorderColor ?? 2,
        fill: false,
      },
    ],
  });

  return (
    <Chart
      data={getChartDataSet(props)}
      options={ChartDefaultOptions}
      type="bar"
    />
  );
}
