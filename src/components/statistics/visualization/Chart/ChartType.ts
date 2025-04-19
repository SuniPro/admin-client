/** labels 배열 개수와 data의 배열 개수는 항상 동일해야합니다.
 * 만약, backgroundColor, borderColor 를 반영한다면 이 또한 labels의 개수와 동일해야합니다. */
export interface SimpleBarChartType {
  label: string;
  legendA: string;
  dataA: number;
  legendB?: string;
  dataB?: number;
}

export interface SimpleLineChartType {
  label: string;
  legendA: string;
  dataA: number;
  legendB?: string;
  dataB?: number;
}

export interface SimpleRadarChartType {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

export interface SimpleFunnerChartType {
  value: number;
  name: string;
  fill: string;
}

/** labels, barData, lineData 배열의 개수는 항상 동일해야합니다. */
export interface SimpleMixedChartType {
  labels: string[];
  barData: number[];
  barLabels: string;
  barBackgroundColor?: string[];
  barBorderColor?: string[];
  barBorderWidth?: number;
  lineData: number[];
  lineLabels: string;
  lineBackgroundColor?: string[];
  lineBorderColor?: string[];
  lineBorderWidth?: number;
}

export const ChartDefaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
};

export interface DoughnutChartTypes {
  name: string;
  value: number;
  fill: string;
}
