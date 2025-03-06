/** labels 배열 개수와 data의 배열 개수는 항상 동일해야합니다.
 * 만약, backgroundColor, borderColor 를 반영한다면 이 또한 labels의 개수와 동일해야합니다. */
export interface SimpleBarChartType{
    labels : string[];
    data : number[];
    backgroundColor? : string[];
    borderColor? : string[];
    borderWidth?: number;
}

/** labels, barData, lineData 배열의 개수는 항상 동일해야합니다. */
export interface SimpleMixedChartType{
    labels : string[];
    barData : number[];
    barLabels : string;
    barBackgroundColor? : string[];
    barBorderColor? : string[];
    barBorderWidth?: number;
    lineData : number[];
    lineLabels : string;
    lineBackgroundColor? : string[];
    lineBorderColor? : string[];
    lineBorderWidth? : number;
}

export const ChartDefaultOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: true
        }
    }
}