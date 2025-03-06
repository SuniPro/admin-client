import {SimpleBarChartType} from "./ChartType";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import {Bar} from "react-chartjs-2";

/** ChartJs 는 기본적으로 트리셰이킹이기 때문에 사용할 컴포넌트들을 미리 등록해서 사용해야합니다. */
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function SimpleBarChart(props: SimpleBarChartType) {
    const getChartDataSet = (chartData: SimpleBarChartType) => ({
            labels: chartData.labels,
            datasets: [
                {
                    label: "데이터 값",
                    data: chartData.data,
                    backgroundColor: chartData.backgroundColor ?? ["rgb(56,97,195)"],
                    borderColor: chartData.borderColor ?? ["rgb(132,168,255)"],
                    borderWidth: chartData.borderWidth ?? 1,
                },
            ],
        })

    return <Bar data={getChartDataSet(props)}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true
                        }
                    }
                }}
    />
}